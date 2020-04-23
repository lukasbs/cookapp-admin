import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {MessageModel} from './model/MessageModel';
import {UserModel} from './model/UserModel';
import {RecipeModel} from './model/RecipeModel';

@Injectable()
export class AppService {
  public message: MessageModel = {text: '', type: ''};
  public messageChanged = new Subject<MessageModel>();

  public userData;

  public userList: UserModel[] = [];
  public userListChanged = new Subject<UserModel[]>();

  public currentUsersPage = 0;
  public currentUsersPageChanged = new Subject<number>();
  public userListChunked = [];

  public currentlyEditedUser: UserModel;
  public currentlyEditedUserChanged = new Subject<UserModel>();

  public recipeList: RecipeModel[] = [];
  public recipeListChanged = new Subject<RecipeModel[]>();

  public currentRecipesPage = 0;
  public currentRecipesPageChanged = new Subject<number>();
  public recipeListChunked = [];

  public currentlyEditedRecipe: RecipeModel;
  public currentlyEditedRecipeChanged = new Subject<RecipeModel>();

  constructor(private http: HttpClient, private router: Router) {
  }

  doLogin(login, pass) {
    this.http.post('http://localhost:8080/api/user/admin/auth/login', {
      name: login,
      password: pass
    }, {
      observe: 'response',
      withCredentials: true
    }).subscribe(
      data => {
        this.userData = data.body;
        this.router.navigate(['/user-list']);
      },
      err => {
        if (err.status === 403) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  getAllUsers() {
    this.http.get('http://localhost:8080/api/user/admin/all', {
        observe: 'response',
        withCredentials: true
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.userList = data.body as UserModel[];
        }
        this.userListChanged.next(this.userList);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.router.navigate(['/login-page']);
        this.messageChanged.next(this.message);
      }
    );
  }

  getUserByName(name: string) {
    this.http.get('http://localhost:8080/api/user/admin/get/' + name, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.userList = data.body as UserModel[];
        } else {
          this.userList = [] as UserModel[];
        }
        this.userListChanged.next(this.userList);
      },
      err => {
        if (err.status === 400) {
          this.message = {text: 'Nie znaleziono użytkownika o podanej nazwie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  deleteUser(userName: string) {
    this.http.delete('http://localhost:8080/api/user/admin/delete/' + userName, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.getAllUsers();
        }
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas usuwania, nie ma takiego użytkownika w bazie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  updateUser(oldName: string, newName: string, newPassword: string, newRole: string) {
    this.http.put('http://localhost:8080/api/user/admin/update/' + oldName, {
      name: newName,
      password: newPassword,
      role: newRole
    }, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.router.navigate(['/user-list']);
        }
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas edytowania, nie ma takiego użytkownika w bazie!', type: 'ERROR'};
        } else if (err.status === 409) {
          this.message = {text: 'Błąd podczas edytowania, użytkownik z podaną nazwą znajduje się już w bazie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  addUser(userName: string, userPassword: string, userRole: string) {
    this.http.post('http://localhost:8080/api/user/admin/add', {
      name: userName,
      password: userPassword,
      role: userRole
    }, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 201) {
          this.router.navigate(['/user-list']);
        }
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas dodawania, niepoprawne dane potrzebne do utworzenia użytkownika!', type: 'ERROR'};
        } else if (err.status === 409) {
          this.message = {text: 'Błąd podczas dodawania, taki użytkownik istnieje już w bazie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  getAllRecipes() {
    this.http.get('http://localhost:8080/api/recipe/all', {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.recipeList = data.body as RecipeModel[];
        }
        this.recipeListChanged.next(this.recipeList);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.router.navigate(['/login-page']);
        this.messageChanged.next(this.message);
      }
    );
  }

  getRecipeByName(name: string) {
    this.http.get('http://localhost:8080/api/recipe/admin/get/' + name, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.recipeList = data.body as RecipeModel[];
        } else {
          this.recipeList = [] as RecipeModel[];
        }
        this.recipeListChanged.next(this.recipeList);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
        }
        this.router.navigate(['/login-page']);
        this.messageChanged.next(this.message);
      }
    );
  }

  addRecipe(name: string, description: string, image: string, source: string, ingredients: {name: string, amount: string}[]) {
    this.http.post('http://localhost:8080/api/recipe/admin/add', {
      name,
      description,
      image,
      ingredients,
      source
    }, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 201) {
          this.router.navigate(['/recipe-list']);
        }
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas dodawania, niepoprawne dane potrzebne do utworzenia przepisu!', type: 'ERROR'};
        } else if (err.status === 409) {
          this.message = {text: 'Błąd podczas dodawania, taki przepis istnieje już w bazie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  updateRecipe(name: string, description: string, image: string, source: string,
               ingredients: {name: string, amount: string}[], oldName: string) {
    this.http.put('http://localhost:8080/api/recipe/admin/update/' + oldName, {
      name,
      description,
      image,
      ingredients,
      source
    }, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.router.navigate(['/recipe-list']);
        }
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas edytowania, nie ma takiego przepisu w bazie!', type: 'ERROR'};
        } else if (err.status === 409) {
          this.message = {text: 'Błąd podczas edytowania, przepis z podaną nazwą znajduje się już w bazie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  deleteRecipe(name: string) {
    this.http.delete('http://localhost:8080/api/recipe/admin/delete/' + name, {
      withCredentials: true,
      observe: 'response'
    }).subscribe(
      data => {
        this.getAllRecipes();
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas usuwania, nie ma takiego przepisu w bazie!', type: 'ERROR'};
        } else {
          this.message = {text: 'Błąd podczas łączenia z serwerem, spróbuj później!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        }
        this.messageChanged.next(this.message);
      }
    );
  }

  parseHTML(url: string, site: string) {
    this.http.get(url, {
      observe: 'response',
      headers: { Accept: 'text/html' },
      responseType: 'text'
    }).subscribe(
      data => {
        if (site === 'przepisy') {
          this.przepisyAlgorythm(data, url);
        } else if ('kukbuk') {
          this.kukbukAlgorythm(data, url);
        }
      },
      err => {
        this.message = {text: 'Błąd podczas parsowania!', type: 'ERROR'};
        this.messageChanged.next(this.message);
      }
    );
  }

  // przepisyAlgorythm(data, url) {
  //   try {
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(data.body, 'text/html');
  //
  //     const name = doc.getElementsByClassName('recipe-details-title').item(0).firstChild.firstChild.textContent;
  //
  //     let description = '';
  //     const descriptionNodes = doc.getElementsByClassName('recipe-container-steps').item(0).getElementsByTagName('li');
  //     for (let i = 0; i < descriptionNodes.length; i++) {
  //       description += '  ' + descriptionNodes.item(i).getElementsByClassName('step-responsive-text').item(0).textContent.trim() + '\n';
  //     }
  //
  //     const ingredients = [];
  //     const ingredientsNodes = doc.getElementsByClassName('ingredient-ul').item(0).getElementsByClassName('ingredient-li');
  //     for (let i = 0; i < ingredientsNodes.length; i++) {
  //       const ingredientName = ingredientsNodes.item(i).getElementsByClassName('ingredient-name').item(0).textContent;
  //       const ingredientAmount = ingredientsNodes.item(i).getElementsByClassName('quantity').length > 0 ?
  //         ingredientsNodes.item(i).getElementsByClassName('quantity').item(0).textContent : '0 g';
  //       ingredients.push({name: ingredientName, amount: ingredientAmount});
  //     }
  //
  //     const image = doc.getElementsByClassName('recipe-preview-image').item(0).getElementsByClassName('holder')
  //       .item(0).getElementsByTagName('img').item(0).getAttribute('data-src');
  //
  //     this.currentlyEditedRecipe = {name, description, image, source: 'Przepis ze strony przepisy.pl - oryginał: ' + url, ingredients};
  //     this.currentlyEditedRecipeChanged.next(this.currentlyEditedRecipe);
  //     this.router.navigate(['/recipe-edit'], { queryParams: { edit: 'false', parse: 'true' } });
  //   } catch (Error) {
  //     this.message = {text: 'Błąd podczas parsowania!', type: 'ERROR'};
  //     this.messageChanged.next(this.message);
  //   }
  // }

  przepisyAlgorythm(data, url) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.body, 'text/html');

      const name = doc.getElementsByClassName('title').item(0).innerHTML;

      let description = '';
      const descriptionNodes = doc.getElementsByClassName('step-info-description');
      for (let i = 0; i < descriptionNodes.length; i++) {
        description += '  ' + descriptionNodes.item(i).innerHTML.trim() + '\n';
      }

      const ingredients = [];
      const ingredientsNodes = doc.getElementsByClassName('ingredients-list-content-container');
      for (let i = 0; i < ingredientsNodes.length; i++) {
        const ingredientName = ingredientsNodes.item(i).getElementsByClassName('ingredient-name').item(0).textContent.trim();
        const ingredientAmount = ingredientsNodes.item(i).getElementsByClassName('quantity').length > 0 ?
            ingredientsNodes.item(i).getElementsByClassName('quantity').item(0).textContent.trim() : '0 g';
        ingredients.push({name: ingredientName, amount: ingredientAmount});
      }

      const image = doc.getElementsByTagName('meta').item(10).content;

      this.currentlyEditedRecipe = {name, description, image, source: 'Przepis ze strony przepisy.pl - oryginał: ' + url, ingredients};
      this.currentlyEditedRecipeChanged.next(this.currentlyEditedRecipe);
      this.router.navigate(['/recipe-edit'], { queryParams: { edit: 'false', parse: 'true' } });
    } catch (Error) {
      this.message = {text: 'Błąd podczas parsowania!', type: 'ERROR'};
      this.messageChanged.next(this.message);
    }
  }

  kukbukAlgorythm(data, url) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.body, 'text/html');

      const name = doc.getElementsByClassName('heading').item(0).firstChild.textContent;

      let description = '';

      const descriptionNodes = doc.getElementsByClassName('widget-text');
      for (let i = 0; i < descriptionNodes.length; i++) {
        description += '  ' + descriptionNodes.item(i).textContent.trim() + '\n';
      }

      const ingredients = [];
      const ingredientsNodes = doc.getElementsByClassName('ingredient');
      for (let i = 0; i < ingredientsNodes.length; i++) {
        if (!ingredientsNodes.item(i).classList.contains('ingredient--header')) {
          const ingredientName = ingredientsNodes.item(i).getElementsByClassName('name').item(0).textContent;
          const ingredientAmount = ingredientsNodes.item(i).getElementsByClassName('quantity').item(0).textContent;
          ingredients.push({name: ingredientName, amount: ingredientAmount});
        }
      }

      // const image = doc.getElementsByClassName('img lazy').item(0).getAttribute('data-srcset').split(' ')[0];
      const image = doc.getElementsByClassName('img-wrap').item(0).getElementsByTagName('img')[0].src;

      this.currentlyEditedRecipe = {name, description, image, source: 'Przepis ze strony kukbuk.pl - oryginał: ' + url, ingredients};
      this.currentlyEditedRecipeChanged.next(this.currentlyEditedRecipe);
      this.router.navigate(['/recipe-edit'], { queryParams: { edit: 'false', parse: 'true' } });

    } catch (Error) {
      this.message = {text: 'Błąd podczas parsowania!', type: 'ERROR'};
      this.messageChanged.next(this.message);
    }
  }

  addErrorMessage(element, message) {
    this.clearClass(element);
    element.classList.add('alert-danger');
    element.innerHTML = message;
  }

  clearClass(element) {
    element.innerHTML = '';
    this.message = {text: '', type: ''};
  }

  cutIntoChunks(initialList) {
    const chunkSize = 5;
    const listChunked = [];

    for (let i = 0, j = 0; i < initialList.length; i += chunkSize, j++) {
      listChunked[j] = initialList.slice(i, i + chunkSize);
    }

    return listChunked;
  }
}
