import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable()
export class AppService {
  public message: {text: string, type: string};
  public messageChanged = new Subject<{text: string, type: string}>();

  public userData;

  public userList: {name: string, password: string, role: string}[] = [];
  public userListChanged = new Subject<{name: string, password: string, role: string}[]>();

  public currentUsersPage = 0;
  public currentUsersPageChanged = new Subject<number>();
  public userListChunked = [];

  public currentlyEditedUser: {name: string, password: string, role: string};
  public currentlyEditedUserChanged = new Subject<{name: string, password: string, role: string}>();

  public recipeList: {name: string, description: string, image: string, ingredients: {name: string, amount: string}[]}[] = [];
  public recipeListChanged = new Subject<{name: string, description: string, image: string,
    ingredients: {name: string, amount: string}[]}[]>();

  public currentRecipesPage = 0;
  public currentRecipesPageChanged = new Subject<number>();
  public recipeListChunked = [];

  public currentlyEditedRecipe: {name: string, description: string, image: string, ingredients: {name: string, amount: string}[]};
  public currentlyEditedRecipeChanged = new Subject<{name: string, description: string, image: string,
    ingredients: {name: string, amount: string}[]}>();

  constructor(private http: HttpClient, private router: Router) {
    this.message = {text: '', type: ''};
  }

  doLogin(login, pass) {
    this.http.post('http://localhost:8080/api/user/admin/auth/login', {
      name: login,
      password: pass
    }, {observe: 'response'}).subscribe(
      data => {
        this.userData = data.body;
        localStorage.setItem('token', this.userData.token);

        this.router.navigate(['/user-list']);
        this.message = {text: 'Udane Logowanie!', type: 'SUCCESS'};
        this.messageChanged.next(this.message);
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
        headers: { Authorization : localStorage.getItem('token') },
        observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.userList = data.body as {name: string, password: string, role: string}[];
        } else if (data.status === 204) {
          this.userList = [] as {name: string, password: string, role: string}[];
        } else {
          console.error(data);
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
      headers: { Authorization : localStorage.getItem('token') },
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.userList = data.body as {name: string, password: string, role: string}[];
        } else if (data.status === 204) {
          this.userList = [] as {name: string, password: string, role: string}[];
        } else {
          console.log(data);
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
      headers: { Authorization : localStorage.getItem('token') },
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.message = {text: 'Usunięto użytkownika!', type: 'SUCCESS'};
          this.getAllUsers();
        } else {
          console.log(data);
        }
        this.messageChanged.next(this.message);
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
      headers: { Authorization : localStorage.getItem('token') },
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.message = {text: 'Poprawnie edytowano użytkownika!', type: 'SUCCESS'};
          this.router.navigate(['/user-list']);
          console.log('http://localhost:8080/api/user/admin/update/' + oldName);
        } else {
          console.log(data);
        }
        this.messageChanged.next(this.message);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas edytowania, nie ma takiego użytkownika w bazie!', type: 'ERROR'};
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
      headers: { Authorization : localStorage.getItem('token') },
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 201) {
          this.message = {text: 'Poprawnie dodano użytkownika!', type: 'SUCCESS'};
          this.router.navigate(['/user-list']);
        } else {
          console.log(data);
        }
        this.messageChanged.next(this.message);
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
      headers: { Authorization : localStorage.getItem('token') },
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.recipeList = data.body as {name: string, description: string, image: string,
            ingredients: {name: string, amount: string}[]}[];
        } else if (data.status === 204) {
          this.recipeList = [] as {name: string, description: string, image: string, ingredients: {name: string, amount: string}[]}[];
        } else {
          console.log(data);
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
      headers: { Authorization : localStorage.getItem('token') },
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.recipeList = data.body as {name: string, description: string, image: string,
            ingredients: {name: string, amount: string}[]}[];
        } else if (data.status === 204) {
          this.recipeList = [] as {name: string, description: string, image: string, ingredients: {name: string, amount: string}[]}[];
        } else {
          console.log(data);
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

  addRecipe(name: string, description: string, image: string, ingredients: {name: string, amount: string}[]) {
    this.http.post('http://localhost:8080/api/recipe/admin/add', {
      name,
      description,
      image,
      ingredients,
    }, {
      headers: { Authorization : localStorage.getItem('token') },
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 201) {
          this.message = {text: 'Poprawnie dodano przepis!', type: 'SUCCESS'};
          this.router.navigate(['/recipe-list']);
        } else {
          console.log(data);
        }
        this.messageChanged.next(this.message);
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

  updateRecipe(name: string, description: string, image: string, ingredients: {name: string, amount: string}[], oldName: string) {
    this.http.put('http://localhost:8080/api/recipe/admin/update/' + oldName, {
      name,
      description,
      image,
      ingredients
    }, {
      headers: { Authorization : localStorage.getItem('token') },
      observe: 'response'
    }).subscribe(
      data => {
        if (data.status === 200) {
          this.message = {text: 'Poprawnie edytowano przepis!', type: 'SUCCESS'};
          this.router.navigate(['/recipe-list']);
        } else {
          console.log(data);
        }
        this.messageChanged.next(this.message);
      },
      err => {
        if (err.status === 401) {
          this.message = {text: 'Niepoprawne dane użytkownika, zaloguj się ponownie!', type: 'ERROR'};
          this.router.navigate(['/login-page']);
        } else if (err.status === 400) {
          this.message = {text: 'Błąd podczas edytowania, nie ma takiego przepisu w bazie!', type: 'ERROR'};
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
      headers: { Authorization : localStorage.getItem('token') },
      observe: 'response'
    }).subscribe(
      data => {
        console.log(data);
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
        console.log(data);
        if (site === 'przepisy') {
          this.przepisyAlgorythm(data, url);
        } else if ('kukbuk') {
          this.kukbukAlgorythm(data, url);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  przepisyAlgorythm(data, url) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.body, 'text/html');

    const name = doc.getElementsByClassName('recipe-details-title').item(0).firstChild.firstChild.textContent +
      '%Przepis ze strony przepisy.pl - oryginał: ' + url;

    let description = '';
    const descriptionNodes = doc.getElementsByClassName('recipe-container-steps').item(0).getElementsByTagName('li');
    for (let i = 0; i < descriptionNodes.length; i++) {
      description += '  ' + descriptionNodes.item(i).getElementsByClassName('step-responsive-text').item(0).textContent.trim() + '\n';
    }

    const ingredients = [];
    const ingredientsNodes = doc.getElementsByClassName('ingredient-ul').item(0).getElementsByClassName('ingredient-li');
    for (let i = 0; i < ingredientsNodes.length; i++) {
      const ingredientName = ingredientsNodes.item(i).getElementsByClassName('ingredient-name').item(0).textContent;
      const ingredientAmount = ingredientsNodes.item(i).getElementsByClassName('quantity').item(0).textContent;
      ingredients.push({name: ingredientName, amount: ingredientAmount});
    }

    const image = doc.getElementsByClassName('recipe-preview-image').item(0).getElementsByClassName('holder')
      .item(0).getElementsByTagName('img').item(0).getAttribute('data-src');

    this.currentlyEditedRecipe = {name, description, image, ingredients};
    this.currentlyEditedRecipeChanged.next(this.currentlyEditedRecipe);
    this.router.navigate(['/recipe-edit'], { queryParams: { edit: 'false', parse: 'true' } });

  }

  kukbukAlgorythm(data, url) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.body, 'text/html');

    const name = doc.getElementsByClassName('heading').item(0).firstChild.textContent +
      '%Przepis ze strony kukbuk.pl - oryginał: ' + url;

    let description = '';

    const descriptionNodes = doc.getElementsByClassName('widget-text');
    for (let i = 0; i < descriptionNodes.length; i++) {
      description += '  ' + descriptionNodes.item(i).textContent.trim() + '\n';
    }

    const ingredients = [];
    const ingredientsNodes = doc.getElementsByClassName('ingredient');
    for (let i = 0; i < ingredientsNodes.length; i++) {
      const ingredientName = ingredientsNodes.item(i).getElementsByClassName('name').item(0).textContent;
      const ingredientAmount = ingredientsNodes.item(i).getElementsByClassName('quantity').item(0).textContent;
      ingredients.push({name: ingredientName, amount: ingredientAmount});
    }

    // const image = doc.getElementsByClassName('img lazy').item(0).getAttribute('data-srcset').split(' ')[0];
    const image = doc.getElementsByClassName('img-wrap').item(0).getElementsByTagName('img')[0].src;

    this.currentlyEditedRecipe = {name, description, image, ingredients};
    this.currentlyEditedRecipeChanged.next(this.currentlyEditedRecipe);
    this.router.navigate(['/recipe-edit'], { queryParams: { edit: 'false', parse: 'true' } });

  }

  addErrorMessage(element, message) {
    this.clearClass(element);
    element.classList.add('alert-danger');
    element.innerHTML = message;
  }

  addSuccessMessage(element, message) {
    this.clearClass(element);
    element.classList.add('alert-success');
    element.innerHTML = message;
  }

  clearClass(element) {
    if (element.classList.contains('alert-success')) {
      element.classList.remove('alert-success');
    } else if (element.classList.contains('alert-danger')) {
      element.classList.remove('alert-danger');
    }
    element.innerHTML = '';
    this.message = {text: '', type: ''};
  }

  cutIntoChunks(initialList) {
    const chunkSize = 2;
    const listChunked = [];

    for (let i = 0, j = 0; i < initialList.length; i += chunkSize, j++) {
      listChunked[j] = initialList.slice(i, i + chunkSize);
    }

    return listChunked;
  }
}
