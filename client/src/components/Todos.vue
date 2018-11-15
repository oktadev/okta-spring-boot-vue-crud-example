<template>
    <div>
        <h1 class="title">Todos</h1>
        <h1 class="email">{{userEmail}}</h1>
        <section class="todoapp">
            <div v-if="loading">
                <h1 class="loading">Loading...</h1>
            </div>
            <div v-else>
                <header class="header">
                    <input class="new-todo"
                           autofocus autocomplete="off"
                           :placeholder="this.inputPlaceholder"
                           v-model="newTodo"
                           @keyup.enter="addTodo">
                </header>
                <section class="main" v-show="todos.length" v-cloak>
                    <input class="toggle-all" type="checkbox" v-model="allDone">
                    <ul class="todo-list">
                        <li v-for="todo in filteredTodos"
                            class="todo"
                            :key="todo.id"
                            :class="{ completed: todo.completed, editing: todo == editedTodo }">
                            <div class="view">
                                <input class="toggle" type="checkbox" v-model="todo.completed" @change="completeTodo(todo)">
                                <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                                <button class="destroy" @click="removeTodo(todo)"></button>
                            </div>
                            <input class="edit" type="text"
                                   v-model="todo.title"
                                   v-todo-focus="todo == editedTodo"
                                   @blur="doneEdit(todo)"
                                   @keyup.enter="doneEdit(todo)"
                                   @keyup.esc="cancelEdit(todo)">
                        </li>
                    </ul>
                </section>
                <footer class="footer" v-show="todos.length" v-cloak>
          <span class="todo-count">
            <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
          </span>
                    <ul class="filters">
                        <li><a href="#/all" @click="setVisibility('all')" :class="{ selected: visibility == 'all' }">All</a></li>
                        <li><a href="#/active" @click="setVisibility('active')" :class="{ selected: visibility == 'active' }">Active</a></li>
                        <li><a href="#/completed" @click="setVisibility('completed')" :class="{ selected: visibility == 'completed' }">Completed</a></li>
                    </ul>
                    <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
                        Clear completed
                    </button>
                </footer>
            </div>
        </section>
        <div v-if="error" class="error" @click="handleErrorClick">
            ERROR: {{this.error}}
        </div>
    </div>
</template>

<script>

  import api from '../Api';

  // visibility filters
  let filters = {
    all: function (todos) {
      return todos
    },
    active: function (todos) {
      return todos.filter(function (todo) {
        return !todo.completed
      })
    },
    completed: function (todos) {
      return todos.filter(function (todo) {
        return todo.completed
      })
    }
  }

  // app Vue instance
  const Todos = {

    name: 'Todos',

    props: {
      activeUser: Object
    },

    // app initial state
    data: function() {
      return {
        todos: [],
        newTodo: '',
        editedTodo: null,
        visibility: 'all',
        loading: true,
        error: null,
      }
    },

    mounted() {
      api.getAll()
        .then(response => {
          this.$log.debug("Data loaded: ", response.data)
          this.todos = response.data
        })
        .catch(error => {
          this.$log.debug(error)
          this.error = "Failed to load todos"
        })
        .finally(() => this.loading = false)
    },

    // computed properties
    // http://vuejs.org/guide/computed.html
    computed: {
      filteredTodos: function () {
        return filters[this.visibility](this.todos)
      },
      remaining: function () {
        return filters.active(this.todos).length
      },
      allDone: {
        get: function () {
          return this.remaining === 0
        },
        set: function (value) {
          this.todos.forEach(function (todo) {
            todo.completed = value
          })
        }
      },
      userEmail: function () {
        return this.activeUser ? this.activeUser.email : ''
      },
      inputPlaceholder: function () {
        return this.activeUser ? this.activeUser.given_name + ', what needs to be done?' : 'What needs to be done?'
      }
    },

    filters: {
      pluralize: function (n) {
        return n === 1 ? 'item' : 'items'
      }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.

    methods: {

      addTodo: function () {
        var value = this.newTodo && this.newTodo.trim()
        if (!value) {
          return
        }

        api.createNew(value, false).then( (response) => {
          this.$log.debug("New item created:", response);
          this.todos.push({
            id: response.data.id,
            title: value,
            completed: false
          })
        }).catch((error) => {
          this.$log.debug(error);
          this.error = "Failed to add todo"
        });

        this.newTodo = ''
      },

      setVisibility: function(vis) {
        this.visibility = vis
      },

      completeTodo (todo) {
        api.updateForId(todo.id, todo.title, todo.completed).then((response) => {
          this.$log.info("Item updated:", response.data);
        }).catch((error) => {
          this.$log.debug(error)
          todo.completed = !todo.completed
          this.error = "Failed to update todo"
        });
      },
      removeTodo: function (todo) { // notice NOT using "=>" syntax
        api.removeForId(todo.id).then(() => { // notice AM using "=>" syntax
          this.$log.debug("Item removed:", todo);
          this.todos.splice(this.todos.indexOf(todo), 1)
        }).catch((error) => {
          this.$log.debug(error);
          this.error = "Failed to remove todo"
        });
      },

      editTodo: function (todo) {
        this.beforeEditCache = todo.title
        this.editedTodo = todo
      },

      doneEdit: function (todo) {
        if (!this.editedTodo) {
          return
        }
        this.$log.info("Item updated:", todo);
        api.updateForId(todo.id, todo.title.trim(), todo.completed).then((response) => {
          this.$log.info("Item updated:", response.data);
          this.editedTodo = null
          todo.title = todo.title.trim()
        }).catch((error) => {
          this.$log.debug(error)
          this.cancelEdit(todo)
          this.error = "Failed to update todo"
        });

        if (!todo.title) {
          this.removeTodo(todo)
        }
      },

      cancelEdit: function (todo) {
        this.editedTodo = null
        todo.title = this.beforeEditCache
      },

      removeCompleted: function () {
        this.todos = filters.active(this.todos)
      },

      handleErrorClick: function () {
        this.error = null;
      },

    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
      'todo-focus': function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    }
  }

  export default Todos

</script>

<style>

    [v-cloak] { display: none; }

</style>
