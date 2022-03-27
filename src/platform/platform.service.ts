import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateWorkInput } from './dto/work.dto';
import { UpdateWorkInput } from './dto/update-work.input';
import { CreateCategoryInput } from './dto/category.dto';
import { Category } from './schema/category';
import { Work } from './schema/work';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(Work)
    private readonly workRepository: MongoRepository<Work>,
    @InjectRepository(Category)
    private readonly categoryRepository: MongoRepository<Category>,
  ) {}

  async createWork(createWorkInput: CreateWorkInput) {
    const work = this.workRepository.create(createWorkInput);
    return await this.workRepository.save(work);
  }

  async createCategory(createCategoryInput: CreateCategoryInput) {
    const category = this.categoryRepository.create(createCategoryInput);
  }

  async findAll() {
    return await this.workRepository.find();
  }

  async findMany(start: number, count: number = 6) {
    return await this.workRepository.find({ take: count });
  }

  async findOne(_id: string) {
    return await this.workRepository.findOne({ _id });
  }

  async findManyByUser(username: string, count: number = 6) {
    return await this.workRepository.find({ user: username, take: count });
  }

  async update(id: number, updateWorkInput: UpdateWorkInput) {
    return await `This action updates a #${id} work`;
  }

  async remove(id: number) {
    return await `This action removes a #${id} work`;
  }
}
