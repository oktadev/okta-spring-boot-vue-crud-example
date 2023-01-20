<template>
  <div class="column justify-center items-center" id="row-container">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h4">Todos</div>
        <q-list padding>
          <q-item
              v-for="item in filteredTodos" :key="item.id"
              clickable
              v-ripple
              rounded
              class="todo-item"
          >
            <TodoItem
                :item="item"
                :deleteMe="handleClickDelete"
                :showError="handleShowError"
                :setCompleted="handleSetCompleted"
                :setTitle="handleSetTitle"
                v-if="filter === 'all' || (filter === 'incomplete' && !item.completed) || (filter === 'complete' && item.completed)"
            ></TodoItem>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <q-item>
          <q-item-section avatar class="add-item-icon">
            <q-icon color="green" name="add_circle_outline"/>
          </q-item-section>
          <q-item-section>
            <input
                type="text"
                ref="newTodoInput"
                v-model="newTodoTitle"
                @change="handleDoneEditingNewTodo"
                @blur="handleCancelEditingNewTodo"
            />
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section style="text-align: center">
        <q-btn color="amber" text-color="black" label="Remove Completed" style="margin-right: 10px"
               @click="handleDeleteCompleted"></q-btn>
        <q-btn-group>
          <q-btn glossy :color="filter === 'all' ? 'primary' : 'white'" text-color="black" label="All"
                 @click="handleSetFilter('all')"/>
          <q-btn glossy :color="filter === 'complete' ? 'primary' : 'white'" text-color="black" label="Completed"
                 @click="handleSetFilter('complete')"/>
          <q-btn glossy :color="filter === 'incomplete' ? 'primary' : 'white'" text-color="black" label="Incomplete"
                 @click="handleSetFilter('incomplete')"/>
          <q-tooltip>
            Filter the todos
          </q-tooltip>
        </q-btn-group>
      </q-card-section>
    </q-card>
    <div v-if="error" class="error">
      <q-banner inline-actions class="text-white bg-red" @click="handleErrorClick">
        ERROR: {{ this.error }}
      </q-banner>
    </div>
  </div>
</template>

<script>

import TodoItem from '@/components/TodoItem';
import { ref } from 'vue'

export default {
  name: 'LayoutDefault',
  components: {
    TodoItem
  },

  data: function() {
    return {
      todos: [],
      newTodoTitle: '',
      visibility: 'all',
      loading: true,
      error: '',
      filter: 'all'
    }
  },

  setup() {
    return {
      alert: ref(false),
    }
  },
  mounted() {
    this.$api.getAll()
        .then(response => {
          this.$log.debug('Data loaded: ', response.data)
          this.todos = response.data
        })
        .catch(error => {
          this.$log.debug(error)
          this.error = 'Failed to load todos'
        })
        .finally(() => this.loading = false)
  },

  computed: {
    filteredTodos() {
      if (this.filter === 'all') return this.todos
      else if (this.filter === 'complete') return this.todos.filter(todo => todo.completed)
      else if (this.filter === 'incomplete') return this.todos.filter(todo => !todo.completed)
      else return []
    }
  },

  methods: {
    handleSetFilter(value) {
      this.filter = value
    },

    handleClickDelete(id) {
      const todoToRemove = this.todos.find(todo => todo.id === id)
      this.$api.removeForId(id).then(() => {
        this.$log.debug('Item removed:', todoToRemove);
        this.todos.splice(this.todos.indexOf(todoToRemove), 1)
      }).catch((error) => {
        this.$log.debug(error);
        this.error = 'Failed to remove todo'
      });
    },

    handleDeleteCompleted() {
      const completed = this.todos.filter(todo => todo.completed)
      Promise.all(completed.map(todoToRemove => {
        return this.$api.removeForId(todoToRemove.id).then(() => {
          this.$log.debug('Item removed:', todoToRemove);
          this.todos.splice(this.todos.indexOf(todoToRemove), 1)
        }).catch((error) => {
          this.$log.debug(error);
          this.error = 'Failed to remove todo'
          return error
        })
      }))
    },

    handleDoneEditingNewTodo() {
      const value = this.newTodoTitle && this.newTodoTitle.trim()
      if (!value) {
        return
      }
      this.$api.createNew(value, false).then((response) => {
        this.$log.debug('New item created:', response)
        this.newTodoTitle = ''
        this.todos.push({
          id: response.data.id,
          title: value,
          completed: false
        })
        this.$refs.newTodoInput.blur()
      }).catch((error) => {
        this.$log.debug(error);
        this.error = 'Failed to add todo'
      });
    },
    handleCancelEditingNewTodo() {
      this.newTodoTitle = ''
    },

    handleSetCompleted(id, value) {
      let todo = this.todos.find(todo => id === todo.id)
      todo.completed = value
    },

    handleSetTitle(id, value) {
      let todo = this.todos.find(todo => id === todo.id)
      todo.title = value
    },

    handleShowError(message) {
      this.error = message
    },

    handleErrorClick() {
      this.error = null;
    },
  },
}
</script>

<style>
#row-container {
  margin-top: 100px;
}

.my-card {
  min-width: 600px;
}

.error {
  color: red;
  text-align: center;
  min-width: 600px;
  margin-top: 10px;
}
</style>
