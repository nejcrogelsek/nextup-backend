import * as mongoose from 'mongoose'
import { Project, ProjectInterface } from '../entities/project.entity'

export const connectDb = async (mongoUrl: string, mongoDbName: string) => {
	return await mongoose.connect(mongoUrl, {
		dbName: mongoDbName
	})
}

export const getAllProjects = async () => {
	return await Project.find()
}
export const addNewProject = async (project: Partial<ProjectInterface>) => {
	const newProject = new Project({
		name: project.name,
		description: project.description
	})

	return await newProject.save()
}