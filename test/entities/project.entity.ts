import * as mongoose from "mongoose";

export interface ProjectInterface extends Document {
	name: string,
	description: string
}

export const ProjectSchema = new mongoose.Schema(
	{
		name: 'string',
		description: 'string'
	}
);

export const Project: mongoose.Model<ProjectInterface> = mongoose.model<ProjectInterface>('Project', ProjectSchema);