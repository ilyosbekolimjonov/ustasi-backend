import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createToolDto: CreateToolDto) {
    try {
      let tool = await this.prisma.tool.create({
        data: {
          nameUz: createToolDto.name_uz,
          nameRu: createToolDto.name_ru,
          nameEn: createToolDto.name_en,
          descriptionUz: createToolDto.description_uz,
          descriptionRu: createToolDto.description_ru,
          descriptionEn: createToolDto.description_en,
          price: createToolDto.price,
          quantity: createToolDto.quantity,
          code: createToolDto.code,
          image: createToolDto.image,
          isAvailable: createToolDto.isAvailable,
          brandId: createToolDto.brandId,
          capacityId: createToolDto.capasityId,
          sizeId: createToolDto.sizeId,
        },
      })
      return tool
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error)
    }
  }

  // async findAll(page = 1, limit = 10, search = '') {
  //   try {
  //     const pageNumber = Number(page)
  //     const limitNumber = Number(limit)

  //     let tools = await this.prisma.tool.findMany({
  //       where: {
  //         OR: [
  //           { name_en: { startsWith: search, mode: "insensitive" } },
  //           { name_ru: { startsWith: search, mode: "insensitive" } },
  //           { name_ru: { startsWith: search, mode: "insensitive" } },
  //         ]
  //       },
  //       skip: (pageNumber - 1) * limitNumber,
  //       take: limitNumber,
  //       include: {
  //         // Basket: true,
  //         brand: true,
  //         capasity: true,
  //         size: true,
  //         ProfessionTool: true
  //       }
  //     })
  //     return tools
  //   } catch (error) {
  //     throw new InternalServerErrorException(error)
  //   }
  // }

  async findAll(
    page = 1,
    limit = 10,
    search = '',
    brandName?: string,
    capasityName?: string,
    sizeName?: string,
    priceFrom?: number,
    priceTo?: number
  ) {
    try {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const whereConditions: any = {
        AND: [],
      };

      if (search) {
        whereConditions.AND.push({
          OR: [
            { nameEn: { contains: search, mode: 'insensitive' } },
            { nameRu: { contains: search, mode: 'insensitive' } },
            { nameUz: { contains: search, mode: 'insensitive' } },
          ],
        });
      }

      if (brandName) {
        whereConditions.AND.push({
          OR: [
            { brand: { nameUz: { contains: brandName, mode: "insensitive" } } },
            { brand: { nameRu: { contains: brandName, mode: "insensitive" } } },
            { brand: { nameEn: { contains: brandName, mode: "insensitive" } } }
          ]
        });
      }

      if (capasityName) {
        whereConditions.AND.push({
          OR: [
            { capacity: { nameUz: { contains: capasityName, mode: "insensitive" } } },
            { capacity: { nameRu: { contains: capasityName, mode: "insensitive" } } },
            { capacity: { nameEn: { contains: capasityName, mode: "insensitive" } } }
          ]
        });
      }

      if (sizeName) {
        whereConditions.AND.push({
          OR: [
            { size: { nameUz: { contains: sizeName, mode: "insensitive" } } },
            { size: { nameRu: { contains: sizeName, mode: "insensitive" } } },
            { size: { nameEn: { contains: sizeName, mode: "insensitive" } } }
          ]
        });
      }

      if (priceFrom || priceTo) {
        const priceFilter: any = {};
        if (priceFrom) priceFilter.gte = Number(priceFrom);
        if (priceTo) priceFilter.lte = Number(priceTo);

        whereConditions.AND.push({ price: priceFilter });
      }
 
      const tools = await this.prisma.tool.findMany({
        where: whereConditions,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        include: {
          brand: true,
          capacity: true,
          size: true,
          professionTools: true,
        },
      });
      return tools;
    } catch (error) {
      console.log(error);

      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      let tool = await this.prisma.tool.findUnique({ where: { id } })
      if (!tool) throw new NotFoundException("Not found")
      return tool
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: string, updateToolDto: UpdateToolDto) {
    try {
      let updated = await this.prisma.tool.update({
        data: {
          nameUz: updateToolDto.name_uz,
          nameRu: updateToolDto.name_ru,
          nameEn: updateToolDto.name_en,
          descriptionUz: updateToolDto.description_uz,
          descriptionRu: updateToolDto.description_ru,
          descriptionEn: updateToolDto.description_en,
          price: updateToolDto.price,
          quantity: updateToolDto.quantity,
          code: updateToolDto.code,
          image: updateToolDto.image,
          isAvailable: updateToolDto.isAvailable,
          brandId: updateToolDto.brandId,
          capacityId: updateToolDto.capasityId,
          sizeId: updateToolDto.sizeId,
        },
        where: { id }
      })
      return updated
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    try {
      let deleted = await this.prisma.tool.delete({ where: { id } })
      return deleted
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}

