import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProductParamsDto } from './dto/productParams.dto';
import { addProductDto } from './dto/addProduct.dto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { updateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts(id: any) {
    const ownProducts = await this.prisma.product.findMany({
      where: {
        userId: Number(id.userId),
      },
    });
    return ownProducts;
  }

  async getProductsCursor({ take, cursor }) {
    return this.prisma.product.findMany({
      take,
      skip: cursor,
    });
  }

  async addProduct(file: any, addProductDto: addProductDto) {
    try {
      const {
        userId,
        category: categoryName,
        name,
        description,
        price,
        tags,
      } = addProductDto;

      const updatedPath = file?.path || null;

      const updatedTags = tags?.split(' ');

      let category;
      if (categoryName) {
        category =
          (await this.prisma.category.findFirst({
            where: {
              categoryName: categoryName,
            },
          })) ??
          (await this.prisma.category.create({
            data: {
              categoryName: categoryName,
              description: 'description',
            },
          }));
      }

      let tagsList;
      if (tags) {
        tagsList = await this.prisma.tags.findMany({
          where: {
            name: {
              in: updatedTags,
            },
          },
        });
        if (tagsList.length !== updatedTags.length) {
          tagsList = [];
          for (const tag of updatedTags) {
            console.log(tag);
            if (tagsList.includes(tag)) break;
            const tagItem = await this.prisma.tags.create({
              data: {
                name: tag,
              },
            });
            tagsList.push(tagItem);
          }
        }
      }

      const product = await this.prisma.product.create({
        data: {
          userId: Number(userId),
          name,
          categoryId: categoryName ? Number(category.id) : undefined,
          description,
          imagesPath: updatedPath,
          price: Number(price),
        },
      });

      let productTags;
      if (tags) {
        productTags = await this.prisma.productTags.createMany({
          data: tagsList.map((tag) => ({
            productId: product.id,
            tagId: tag.id,
          })),
        });
      }

      return { product, productTags, category, tagsList };
    } catch (error) {
      console.log(error);
    }
  }

  async getProductWithParams(query: ProductParamsDto) {
    const productParams = query as ProductParamsDto;
    const updatedQuery = productParams.q ?? '',
      page = Number(productParams.p ?? 1),
      costLow = Number(productParams.clo ?? 0),
      costHigh = Number(productParams.chi ?? 999999999),
      sortBy = productParams.s ?? 'createdAt',
      order = productParams.o ?? 'asc',
      timeSince = Number(productParams.t ?? 999999999),
      ratingLow = Number(productParams.rlo ?? 0),
      ratingHigh = Number(productParams.rhi ?? 999999999),
      someTags = productParams.stags
        ? productParams.stags.split(',')
        : undefined,
      allTags = productParams.atags ? productParams.atags.split(',') : [],
      notAnyTags = productParams.ntags ? productParams.ntags.split(',') : [];
    
    try {
      if (updatedQuery === '') {
        let products = await this.prisma.product.findMany({
          skip: page ? page - 1 + (page - 1) * 10 : 1,
          take: 10,
          where: {
            AND: [
              {
                price: {
                  gte: costLow,
                  lte: costHigh,
                },
              },
              {
                OR: [
                  {
                    ratingsAvg: {
                      gte: ratingLow,
                      lte: ratingHigh,
                    }
                  },
                  {
                    ratingsAvg: null
                  }
  
                ],
              },
              {
                createdAt: {
                  gte: new Date(Number(timeSince)),
                }
              },
              {
                name: {
                  contains: updatedQuery,
                  mode: 'insensitive',
                },
                //we could make new query for other params if this one is empty
              },
            ],
          },
          orderBy: {
            [sortBy]: order,
        }
        });

        // check if product has been ordered
        const tempProducts = [];
        products.map((product) => {
          if (product.orderId) {
            return;
          } else {
            tempProducts.push(product);
          }
        });

        products = tempProducts;

        return { products };
      } else {
        const tags = await this.prisma.tags.findMany({
          where: {
            name: {
              in: updatedQuery,
            },
          },
        });

        if (tags) {
          const productTags = await this.prisma.productTags.findMany({
            where: {
              tagId: {
                in: tags.map((tag) => tag.id),
              },
            },
          });

          const productIds = productTags.map(
            (productTag) => productTag.productId,
          );

          // const products = await this.prisma.product.findMany({
          //   skip: page - 1,
          //   take: 10,
          //   where: {
          //     AND: [
          //       {
          //         id: {
          //           in: productIds,
          //         },
          //       },
          //       {
          //         price: {
          //           gte: costLow,
          //           lte: costHigh,
          //         },
          //         OR: [
          //           {
          //             name: {
          //               contains: updatedQuery,
          //               mode: 'insensitive',
          //             },
          //           },
          //           {
          //             description: {
          //               contains: updatedQuery,
          //               mode: 'insensitive',
          //             },
          //           },
          //         ],
          //       },
          //     ],
          //     createdAt: {
          //       gte: new Date(timeSince),
          //     },
          //   },
          // orderBy: {
          //   [sortBy]: order,
          // },
          // });

          let products = await this.prisma.product.findMany({
            skip: page - 1 + (page - 1) * 10,
            take: 10,
            where: {
              AND: [
                {
                  price: {
                    gte: costLow,
                    lte: costHigh,
                  },
                },
                {
                  OR: [
                    {
                      ratingsAvg: {
                        gte: ratingLow,
                        lte: ratingHigh,
                      }
                    },
                    {
                      ratingsAvg: null
                    }
    
                  ],
                },
                {
                  createdAt: {
                    gte: new Date(Number(timeSince)),
                  }
                },
                {
                  name: {
                    contains: updatedQuery,
                    mode: 'insensitive',
                  },
                  //we could make new query for other params if this one is empty
                },
              ],
            },
            orderBy: {
              [sortBy]: order,
          }
          });

          // check if product has been ordered
          const tempProducts = [];
          products.map((product) => {
            if (product.orderId) {
              return;
            } else {
              tempProducts.push(product);
            }
          });

          products = tempProducts;

          // console.log(products);

          // console.log(`products: ${newProducts}`);    !!!why does this give back [object Object]????!!!

          const images = [];
          const files = products.map((product) => {
            const imagePath = product.imagesPath;
            const image = readFileSync(
              join(__dirname, '..', '..', '..', imagePath),
            );
            images.push(image);
          });

          return { products, images };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findOneProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) return;

    const imagePath =
      product.imagesPath !== 'undefined' ? product.imagesPath : null;

    const image = imagePath
      ? readFileSync(join(__dirname, '..', '..', '..', imagePath))
      : null;

    return { product, image };
  }

  async getProductsOffset(id: string) {
    try {
      const products = await this.prisma.product.findMany({
        skip: Number(id) - 1,
        take: 6,
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id: string, updatedProduct: updateProductDto) {
    try {
      const { name, description, price, categoryName, tags, ratings } =
        updatedProduct;

      const updatedTags = tags ? tags.split(' ') : [];

      const category = await this.prisma.category.findFirst({
        where: {
          categoryName: categoryName || 'default',
        },
      });

      if (!category) {
        const category = await this.prisma.category.create({
          data: {
            categoryName: categoryName || 'default',
            description: 'description',
          },
        });
      }

      const tagsList = await this.prisma.tags.findMany({
        where: {
          name: {
            in: updatedTags,
          },
        },
      });

      if (tagsList.length !== updatedTags.length) {
        const tagList = [];
        for (const tag of updatedTags) {
          const tagItem = await this.prisma.tags.create({
            data: {
              name: tag,
            },
          });
          tagsList.push(tagItem);
        }
      }

      const ratingAverage = await this.prisma.product.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          ratings: true,
        },
      });

      const ratingsSum = ratingAverage.ratings.reduce((a, b) => a + b, 0);
      let newAverage = ratingsSum / ratingAverage.ratings.length;
      if (isNaN(newAverage)) {
        newAverage = 0;
      } else {
        return newAverage;
      }

      const product = await this.prisma.product.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          description,
          price: Number(price),
          categoryId: category.id ?? 1,
          ratingsAvg: newAverage ?? 0,
          ratings,
        },
      });

      const productTags = await this.prisma.productTags.createMany({
        data: tagsList.map((tag) => ({
          productId: product.id,
          tagId: tag.id,
        })),
      });

      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.prisma.product.delete({
        where: {
          id: Number(id),
        },
      });
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async downloadFile() {
    console.log(
      readFileSync(
        join(
          __dirname,
          '..',
          '..',
          '..',
          'uploads',
          '5c110a2bc80da4255e0ea6cf8a7b1cfe',
        ),
      ),
    );

    return readFileSync(
      join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        '5c110a2bc80da4255e0ea6cf8a7b1cfe',
      ),
    );
  }
}
