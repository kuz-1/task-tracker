const fs = require('fs')
const path = './tasks.json'

const [, , command, ...args] = process.argv

function loadTasks() {
    if (!fs.existsSync(path)) {
        return []
    }
    const data = fs.readFileSync(path, 'utf8')
    if (data) {
        return JSON.parse(data)
    } 
    else {
        return []
    }
}

function saveTasks(tasks) {
    fs.writeFileSync(path, JSON.stringify(tasks, null, 2))
}

switch(command) {
    case 'add': {
        description = args[0]
        if(!description) {
            console.log("Error! Description can't be empty")
            process.exit(1)
        }
        const tasks = loadTasks();
        const newTask = {
            id: tasks.length > 0  ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            description: description, 
            status: 'todo',
            createdAt: new Date().toLocaleString('lv-LV', { timeZone: 'Europe/Riga' }),
            updatedAt: new Date().toLocaleString('lv-LV', { timeZone: 'Europe/Riga' })
        }
        tasks.push(newTask);
        saveTasks(tasks)
        console.log(`Task added successfully ID ${newTask.id}`)
        break
    }
    case 'list': {
        const filterStatus = args[0]
        const tasks = loadTasks()

        const filtered = filterStatus ? tasks.filter(t => t.status === filterStatus) : tasks;

        if(filtered.length === 0) {
            console.log(`No tasks found`)
            break
        }

        filtered.forEach(t => {

            console.log(`[${t.id}] ${t.description} | Status: ${t.status} | Created at: ${t.createdAt} | Updated at ${t.updatedAt}`)
            
        })
        break


    }

    case 'delete': {
        const deletedID = Number(args[0])
        if (args[0]=== undefined) {
            console.log(`Error! ID is undefined`)
            break
        }
        else if (!Number.isInteger(deletedID)) {
            console.log(`Error! ID must be an integer`)
            break
        }
        
        const tasks = loadTasks();

        const index = tasks.filter(t => t.id === deletedID);

        if (index !== -1 ) {
            tasks.splice(index, 1)
            saveTasks(tasks)
            console.log(`Task with ID: ${deletedID} was successfully deleted`)
            break
        }
        else {
            console.log(`Task with ID: ${deletedID} was not found`)
            break
        }


    }

    case 'update': {
        const updatedID = Number(args[0])
        const updatedDescription = args[1]
        if (args[0]=== undefined) {
        console.log(`Error! ID is undefined`)
            break
        }
        else if (!Number.isInteger(updatedID)) {
            console.log(`Error! ID must be an integer`)
            break
        }
        else if (args[1] === undefined) {
            console.log(`Error! Description is undefined`)
            break
        }
        const tasks = loadTasks()

        const updatedTask = tasks.find(t => t.id === updatedID)
        if(updatedTask) {
        updatedTask.description = updatedDescription
        updatedTask.updatedAt = new Date().toLocaleString('lv-LV', {timeZone: 'Europe/Riga'})
        saveTasks(tasks)
        console.log(`Task with ID: ${updatedID} was successfully updated`)
        }
        else {
            console.log(`Error! Task with ID: ${updatedID} was not found`)
        }
        break
    }

    case 'mark-done': {
        const idToMark = Number(args[0])
        if (args[0]=== undefined) {
            console.log(`Error! ID is undefined`)
            break
        }
        else if (!Number.isInteger(idToMark)) {
            console.log(`Error! ID must be an integer`)
            break
        }
        const tasks = loadTasks()
        const updatedTask = tasks.find(t => t.id === idToMark) 

        if (updatedTask) {
            if (updatedTask.status === 'done') {
                console.log(`Error! Task with ID: ${idToMark} is already marked as done`)
                break
            }
            updatedTask.status = 'done'
            updatedTask.updatedAt = new Date().toLocaleString('lv-LV', {timeZone: 'Europe/riga'})
            saveTasks(tasks)
            console.log(`Task with ID: ${idToMark} is marked done`)
        }
        break
    }
    case 'mark-in-progress': {
        const idToMark = Number(args[0])
        if (args[0] === undefined) {
            console.log(`Error! ID is undefined`)
            break
        }
        else if (!Number.isInteger(idToMark)) {
            console.log(`Error! ID must be an integer`)
            break
        }
        const tasks = loadTasks()
        const updatedTask = tasks.find(t => t.id === idToMark)

        if (updatedTask) {
            if(updatedTask.status === 'done') {
                console.log(`Error! Task with ID: ${idToMark} is already marked as done`)
                break
            }
            else if(updatedTask.status === 'in-progress') {
                console.log(`Error! Task with ID: ${idToMark} is already marked as in progress`)
                break
            }
            updatedTask.status = 'in-progress'
            updatedTask.updatedAt = new Date().toLocaleString('lv-LV', {timeZone: 'Europe/riga'})
            saveTasks(tasks)
            console.log(`Task with ID: ${idToMark} was successfully marked in progress`)
            break
        }
    }
    default:
        console.log("Command not found: Available: add, list, delete, update, mark-done")


}