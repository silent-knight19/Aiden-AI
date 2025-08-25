import projectmodel from "../Models/project.model.js";


export const CreateProject = async ({name,userID }) => {
    if(!name || !userID){
        throw new Error("Name and userID are required");
    }
    const project = await projectmodel.create({name,userID});
    return project;
    
}