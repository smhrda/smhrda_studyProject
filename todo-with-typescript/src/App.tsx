import React, { FC, useState, ChangeEvent } from 'react';
import './App.css';
import TodoTask from './Components/TodoTask';
import { ITask } from './Interfaces';

let nextId = 0;

const App: FC = () => {
    const [task, setTask] = useState<string>('');
    const [deadline, setDeadline] = useState<string>();
    const [todoList, setTodoList] = useState<ITask[]>([]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.name === 'task') {
            setTask(event.target.value);
        } else {
            setDeadline(event.target.value);
        }
    };

    const addTask = (): void => {
        const newTask = {
            id: nextId,
            taskName: task,
            deadline: deadline,
        };
        setTodoList([...todoList, newTask]);
        // 초기화
        setTask('');
        setDeadline('');
        nextId += 1;
    };

    const today: Date = new Date();
    // 날짜 표시
    const toDateString = (date: Date) => {
        const dateString: string = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        return dateString;
    };

    return (
        <div className="App">
            <h1>{toDateString(today)}</h1>
            <div className="header">
                <div className="inputContainer">
                    <input
                        type="text"
                        placeholder="할 일을 입력하세요..."
                        name="task"
                        value={task}
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        placeholder="마감일을 입력하세요..."
                        name="deadline"
                        value={deadline || ''} //deadline만 써두면 값이 undefined일 때(새로고침 후) 에러 발생함
                        onChange={handleChange}
                        id="dateInput"
                    />
                </div>
                <button onClick={addTask}>ADD TASK</button>
            </div>
            <div className="todoList">
                {todoList.map((task: ITask, key: number) => {
                    return (
                        <TodoTask
                            key={task.id}
                            task={task}
                            completeTask={(completedId: number) => {
                                setTodoList(
                                    todoList.filter((task) => {
                                        return task.id !== completedId;
                                    })
                                );
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default App;
