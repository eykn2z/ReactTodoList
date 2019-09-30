import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import { Button, ListItemIcon } from "@material-ui/core";
import EditOutlined from "@material-ui/icons/EditOutlined";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import "./styles.css";

function App() {
  const [todoList, setTodoList] = useState([]); //mapが配列じゃないものはエラーになる
  const [todoValue, setTodoValue] = useState("");
  const [loading, setLoading] = useState();
  const [newtodoList, setNewtodoList] = useState([
    { id: 0, content: "ねこに会う", editflg: false, isDone: true },
    { id: 1, content: "いぬに会う", editflg: false, isDone: false },
    { id: 2, content: "しばに会う", editflg: false, isDone: true }
  ]);

  const baseUrl =
    "https://jsonbox.io/box_8e9c8bd8ab24ac7b27f1/5d9046d471cce900175d6798";

  const initTodoList = () => {
    setNewtodoList([
      { id: 0, content: "ねこに会う", editflg: false, isDone: true },
      { id: 1, content: "いぬに会う", editflg: false, isDone: false },
      { id: 2, content: "しばに会う", editflg: false, isDone: true }
    ]);
  };

  const handleTodoValue = event => {
    setTodoValue(event.target.value);
  };

  const getTodoList = () => {
    setLoading(true);
    axios
      .get(baseUrl)
      .then(response => {
        setTodoList(response.data.todos);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateTodoList = () => {
    setTodoList([...todoList, todoValue]);
    setTodoValue("");
    axios
      .put(baseUrl, {
        todos: [...todoList, todoValue]
      })
      .then(response => {
        console.log("success", response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const renameTodoList = todo => {
    todo.editflg = !todo.editflg;
    setNewtodoList([...newtodoList]);
  };

  const checkTodo = id => {
    newtodoList[id].isDone = !newtodoList[id].isDone;
    setNewtodoList([...newtodoList]);
  };

  const TodoItem = props => {
    if (props.editflg === true) {
      return (
        <span>
          <input value={props.value} className="input" />
        </span>
      );
    } else {
      return (
        <span className={props.doneflg ? "done" : "normal-value"}>
          {props.value}
        </span>
      );
    }
  };

  const removeTodoList = value => {
    const newTodoList = todoList.filter(v => v !== value);
    setTodoList([...newTodoList]);
    axios
      .put(baseUrl, {
        todos: [...newTodoList]
      })
      .then(response => {
        console.log("delete");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const clearTodoList = () => {
    axios
      .put(baseUrl, {
        todos: []
      })
      .then(response => {
        alert("data clear");
        console.log("data clear success", response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getTodoList();
  }, []);

  const Todo = props => {
    return props.contents.map(todo => {
      return (
        <ListItem key={todo.id} button>
          <ListItemIcon>
            <Checkbox
              color="primary"
              name="saveAddress"
              value="Yes"
              checked={todo.isDone}
              onChange={() => checkTodo(todo.id)}
            />
          </ListItemIcon>

          <TodoItem
            value={todo.content}
            doneflg={todo.isDone}
            editflg={todo.editflg}
          />

          <ListItemSecondaryAction>
            <span onClick={() => renameTodoList(todo)}>
              <EditOutlined />
            </span>
            <span onClick={() => removeTodoList(todo)}>
              <DeleteOutlined />
            </span>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  return (
    <div className="App">
      <div className="title">
        <h1>Todo List</h1>
        <span className="subtitle">やりたいことリスト</span>
        <p>{loading ? "loading..." : ""}</p>
      </div>

      <div className="todo-wrapper">
        <Todo contents={newtodoList} />
      </div>

      <div className="todo-action">
        <input value={todoValue} onChange={handleTodoValue} />
        <Button onClick={updateTodoList} variant="contained">
          ADD
        </Button>
        <p>
          <Button onClick={initTodoList} variant="contained">
            Init
          </Button>
          　
          <Button onClick={clearTodoList} variant="contained">
            Clear
          </Button>
        </p>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
