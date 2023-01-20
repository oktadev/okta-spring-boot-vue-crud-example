<template>
  <q-item-section avatar class="check-icon" v-if="this.item.completed">
    <q-icon color="green" name="done" @click="handleClickSetCompleted(false)"/>
  </q-item-section>
  <q-item-section avatar class="check-icon" v-else>
    <q-icon color="gray" name="check_box_outline_blank" @click="handleClickSetCompleted(true)"/>
  </q-item-section>
  <q-item-section v-if="!editing">{{ this.item.title }}</q-item-section>
  <q-item-section v-else>
    <input
        class="list-item-input"
        type="text"
        name="textinput"
        ref="input"
        v-model="editingTitle"
        @change="handleDoneEditing"
        @blur="handleCancelEditing"
    />
  </q-item-section>
  <q-item-section avatar class="hide-icon" @click="handleClickEdit">
    <q-icon color="primary" name="edit"/>
  </q-item-section>
  <q-item-section avatar class="hide-icon close-icon" @click="handleClickDelete">
    <q-icon color="red" name="close"/>
  </q-item-section>
</template>
<script>

import { nextTick } from 'vue'

export default {
  name: 'TodoItem',
  props: {
    item: Object,
    deleteMe: Function,
    showError: Function,
    setCompleted: Function,
    setTitle: Function
  },
  data: function () {
    return {
      editing: false,
      editingTitle: this.item.title,
    }
  },
  methods: {
    handleClickEdit() {
      this.editing = true
      this.editingTitle = this.item.title
      nextTick(function () {
        this.$refs.input.focus()
      }.bind(this))
    },
    handleCancelEditing() {
      this.editing = false
    },
    handleDoneEditing() {
      this.editing = false
      this.$api.updateForId(this.item.id, this.editingTitle, this.item.completed).then((response) => {
        this.setTitle(this.item.id, this.editingTitle)
        this.$log.info('Item updated:', response.data);
      }).catch((error) => {
        this.showError('Failed to update todo title')
        this.$log.debug(error)
      });
    },
    handleClickSetCompleted(value) {
      this.$api.updateForId(this.item.id, this.item.title, value).then((response) => {
        this.setCompleted(this.item.id, value)
        this.$log.info('Item updated:', response.data);
      }).catch((error) => {
        this.showError('Failed to update todo completed status')
        this.$log.debug(error)
      });
    },
    handleClickDelete() {
      this.deleteMe(this.item.id)
    }
  }
}
</script>

<style scoped>
.todo-item .close-icon {
  min-width: 0px;
  padding-left: 5px !important;
}

.todo-item .hide-icon {
  opacity: 0.1;
}

.todo-item:hover .hide-icon {
  opacity: 0.8;
}

.check-icon {
  min-width: 0px;
  padding-right: 5px !important;
}

input.list-item-input {
  border: none;
}
</style>
