import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import {RecipeModel} from '../model/RecipeModel';
import {Router} from '@angular/router';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit {

  public recipe: RecipeModel;


  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    if (this.appService.currentlyEditedRecipe === undefined || this.appService.currentlyEditedRecipe === null) {
      this.router.navigate(['/recipe-list']);
    }
    this.recipe = this.appService.currentlyEditedRecipe;
  }

}
