import React from 'react';
import { ITask } from '../Interfaces';

type todoProps = {
    task: ITask;
    completeTask: (completedId: number) => void;
};

const TodoTask = ({ task, completeTask }: todoProps) => {
    const handleComplete = () => completeTask(task.id);

    return (
        <div className="task">
            <div className="content">
                <span>{task.taskName}</span>
                <span>{task.deadline} 까지</span>
            </div>
            <button onClick={handleComplete}>완료</button>
        </div>
    );
};

export default TodoTask;
