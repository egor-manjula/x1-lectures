'use strict';

// All including jQuery loaded
$(document).ready(function () {
});

// Shorthand
$(function () {

    var TodoMVC = {
        todoList: [],

        addTodo: function (todoText) {

            var todo = {
                text: todoText,
                done: false,
                id: Date.now()
            };

            // this = TodoMVC
            this.todoList.push(todo);

            // Called implicitly
            // TodoMVC.render();
            this.render();
        },

        removeTodo: function (index) {
            this.todoList.splice(index, 1);
        },

        clearCompleted: function () {
            console.log('Should clear all completed items');

            // TODO: Optimize multiple render call
            this.todoList.forEach(function (todo, index, array) {
                if (todo.done) {
                    this.removeTodo(index);
                }
            }, this);

            this.render();
        },

        init: function() {
            this._bindEvents();
            this._initTemplates();
        },

        _initTemplates: function() {
            // this === TodoMVC
            this._template = $('#todo-template').html();
        },

        _bindEvents: function() {
            var todoListContainer = $('#todo-list');

            // Delegate event
            todoListContainer.on('click', 'span', function(event) {
                // ul li span - event.currentTarget or this
                var todoItemContainer = $(event.currentTarget).parent();
                var todoId = todoItemContainer.data('id');

                this.todoList.forEach(function(todo, indexToRemove) {
                    if (todo.id === todoId) {
                        this.removeTodo(indexToRemove);
                    }
                }, this);

                this.render();
            }.bind(this));

            todoListContainer.on('change', 'input', function(event) {
                // ul li span - event.currentTarget or this
                var todoItemContainer = $(event.currentTarget).parent();
                var todoId = todoItemContainer.data('id');

                this.todoList.forEach(function (todo) {
                    if (todo.id === todoId) {
                        todo.done = event.currentTarget.checked;
                    }
                }, this);
            }.bind(this));
        },

        render: function () {
            $('#todo-list').html(Mustache.render(this._template, {
                todos: this.todoList
            }));

            var activeItemsLeft = $('#active-items-left');
            activeItemsLeft.innerHTML = this.todoList.filter(function (todo) {
                return !todo.done;
            }).length;
        }
    };

    // Make TodoMVC global
    window.TodoMVC = TodoMVC;

    // Input
    $('#todo-text').on('keyup', function (event) {
        if (event.keyCode === 13) {
            TodoMVC.addTodo(this.value);
            this.value = '';
        }
    });

    // Clear all completed button
    $('#clear-completed').on('click', function () {
        TodoMVC.clearCompleted();
    });

    TodoMVC.init();
});
