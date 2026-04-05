import prisma from '../../config/db';
import { Errors } from '../../common/utils/apiError';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schema';

export const categoriesService = {

  async findAll() {
    return prisma.category.findMany({
      where:   { deletedAt: null },
    });
  },


  async findById(id: string) {
    const category = await prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
    if (!category) throw Errors.notFound('Category');
    return category;
  },


  async nameAlreadyExists(name: string, excludeId?: string): Promise<boolean> {
    const category = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        deletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!category;
  },


  async create(input: CreateCategoryInput, userId: string) {
    const exists = await categoriesService.nameAlreadyExists(input.name);
    if (exists) throw Errors.conflict(`Category "${input.name}" already exists`);

    return prisma.category.create({
      data: {
        ...input,
        isSystem:  false,
        createdBy: userId,
      },
    });
  },

  async update(id: string, input: UpdateCategoryInput) {
    const category = await categoriesService.findById(id);

    if (category.isSystem) {
      throw Errors.forbidden('System categories cannot be modified');
    }

    if (input.name) {
      const exists = await categoriesService.nameAlreadyExists(input.name, id);
      if (exists) throw Errors.conflict(`Category "${input.name}" already exists`);
    }

    return prisma.category.update({
      where: { id },
      data:  input,
    });
  },


  async delete(id: string) {
    const category = await categoriesService.findById(id);

    if (category.isSystem) {
      throw Errors.forbidden('System categories cannot be deleted');
    }

    const recordCount = await prisma.financialRecord.count({
      where: { categoryId: id, deletedAt: null },
    });

    if (recordCount > 0) {
      throw Errors.badRequest(
        `Cannot delete category — it is used by ${recordCount} financial record(s)`,
      );
    }

    await prisma.category.update({
      where: { id },
      data:  { deletedAt: new Date() },
    });
  },
};