import {IngredientModel} from './IngredientModel';

export class RecipeModel {
  constructor(
    public name: string,
    public description: string,
    public image: string,
    public source: string,
    public ingredients: IngredientModel[]
  ) {}
}
