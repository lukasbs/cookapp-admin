import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit {

  public recipe: {name: string, description: string, image: string, ingredients: {name: string, amount: string}[]};


  constructor(private appService: AppService) { }

  ngOnInit() {
    this.recipe = this.appService.currentlyEditedRecipe;
  }

}
