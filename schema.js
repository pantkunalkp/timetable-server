const { gql } = require('apollo-server');

const typeDefs = gql`
	type Department {
		id: ID!
		name: String!
	}

	type Course {
		id: ID!
		name: String!
		courseCode: String!
		semester: String!
		department: String!
	}

	type Faculty {
		id: ID!
		name: String!
		department: String!
	}

	type Query {
		faculties: [Faculty]!
		faculty(id: ID!): Faculty!
		courses: [Course]!
		course(courseCode: String!): Course
		departments: [Department]!
		department(name: String!): Department
	}

	type Mutation {
		newFaculty(name: String!, department: String!): Faculty!
		updateFaculty(id: ID!): Faculty!
		deleteFaculty(id: ID!): Faculty!
	}
`;

module.exports = typeDefs;
