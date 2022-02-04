<template>
  <div class="hello">
    <div class="container">
      <div class="row">
        <div class="col-3 border border-success rounded p-3">
          <img alt="Vue logo" src="../assets/logo.png" class="mb-3" />
          <div>
            <div class="form-check form-check-inline mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="inlineCheckbox2"
                v-model="newTodo.completed"
              />
              <label class="form-check-label" for="inlineCheckbox2"
                >Completed</label
              >
            </div>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="todo title"
                id="title"
                v-model="newTodo.title"
              />
              <label for="title">Title</label>
            </div>
            <button type="submit" class="btn btn-success" @click="addNewTodo">
              Add New Todo
            </button>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="todo title"
                id="title"
                v-model="updateTitle"
              />
              <label for="title">Update Title</label>
            </div>
            <button type="submit" class="btn btn-primary" @click="updateTodo">
              Add New Todo
            </button>
          </div>
        </div>
        <div
          class="col-3 border border-success rounded d-flex align-items-center justify-content-center flex-column mx-3"
        >
          <div>
            <label class="h3 text-success">Title</label>
            <div>{{ newTodo.title || "not found title" }}</div>
          </div>
          <div>
            <label class="h3 text-success">Completed</label>
            <div>{{ newTodo.completed }}</div>
          </div>
        </div>
        <div
          class="col-5 border-success rounded d-flex align-items-center justify-content-center flex-column overflow-auto"
        >
          <div
            v-if="!todos.length > 0"
            class="alert alert-warning"
            role="alert"
          >
            Todo is empty
          </div>
          <ul v-else class="list-group w-100">
            <li
              v-for="todo in todos"
              :key="todo.id"
              @dblclick="getSingleTodo(todo.id)"
              class="overflow-auto list-group-item mx-0 my-0 list-group-item-action list-group-item-success d-flex justify-content-between align-items-center"
            >
              {{ todo.title }}
              <span
                class="badge badge-danger bg-light badge-pill text-success"
                @click="delTodo(todo.id)"
                >x</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container mt-4">
      <div class="form-floating mb-3">
        <input
          type="email"
          class="form-control"
          placeholder="todo title"
          id="title"
          v-model="user.email"
        />
        <label for="title">E-mail</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="password"
          class="form-control"
          placeholder="todo title"
          id="title"
          v-model="user.password"
        />
        <label for="title">Password</label>
      </div>
      <button type="submit" class="btn btn-warning" @click="createUser">
        Add New Todo
      </button>
      <button type="submit" class="btn btn-warning" @click="sigin">
        Login
      </button>
    </div>
    <button class="btn btn-danger" @click="logout">Logout</button>
  </div>
</template>

<script>
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  // where,
  orderBy,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
const auth = getAuth();
import { db } from "../Firebase.js";
const colRef = collection(db, "todos");
// const q = query(
//   colRef,
//   where("completed", "==", true),
//   orderBy("title", "asc")
// );
const q = query(colRef, orderBy("created", "asc"));
export default {
  name: "HelloWorld",
  data() {
    return {
      todos: [],
      updateID: null,
      updateTitle: null,
      newTodo: { title: "", completed: false },
      user: {
        email: null,
        password: null,
      },
    };
  },
  methods: {
    getAll() {
      getDocs(colRef)
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            this.todos.push({ ...doc.data(), id: doc.id });
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    getRealAll() {
      onSnapshot(colRef, (snapshot) => {
        this.todos = [];
        snapshot.docs.forEach((doc) => {
          this.todos.push({ ...doc.data(), id: doc.id });
        });
      });
    },
    getRealAllQueryWhre() {
      onSnapshot(q, (snapshot) => {
        this.todos = [];
        snapshot.docs.forEach((doc) => {
          this.todos.push({ ...doc.data(), id: doc.id });
        });
      });
    },
    async addNewTodo() {
      await addDoc(colRef, {
        title: this.newTodo.title,
        completed: this.newTodo.completed,
        created: serverTimestamp(),
      }).then(() => {
        this.newTodo.title = "";
        this.newTodo.completed = false;
        // alert("added");
      });
    },
    async delTodo(id) {
      const docRef = doc(db, "todos", id);
      deleteDoc(docRef);
    },
    async getSingleTodo(id) {
      const docRef = doc(db, "todos", id);
      getDoc(docRef).then((doc) => {
        console.log(doc.data(), doc.id);
        this.updateTitle = doc.data().title;
        this.updateID = doc.id;
      });
    },
    async updateTodo() {
      const docRef = doc(db, "todos", this.updateID);
      updateDoc(docRef, {
        title: this.updateTitle,
      }).then(() => {
        this.updateID = null;
        this.updateTitle = null;
      });
    },
    async createUser() {
      createUserWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((cred) => {
          console.log("created user", cred.user);
          this.user.email = null;
          this.user.password = null;
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    async logout() {
      signOut(auth)
        .then(() => {
          console.log("logout process successfull");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    async sigin() {
      signInWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((cred) => {
          console.log("signin user", cred.user);
          this.user.email = null;
          this.user.password = null;
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    async stateChanged() {
      onAuthStateChanged(auth, (user) => {
        console.log("user Status Changed : ", user);
      });
    },
  },
  created() {
    this.getRealAllQueryWhre();
    this.stateChanged();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
