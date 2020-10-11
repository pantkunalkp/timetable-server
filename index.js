var firebaseConfig = require('./firebase/firebaseConfig');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const fs = require('fs');

const courses = require('./courses.json');
const departments = require('./departments.json');

var firebase = require('firebase/app');
require('firebase/firestore');

firebase.initializeApp(firebaseConfig);
let facultiesRef = firebase.firestore().collection('faculties');
let departmentsRef = firebase.firestore().collection('departments');
const resolvers = {
	Query: {
		faculties: async () => {
			let allFaculties = [];
			const snapshot = await facultiesRef.get();
			await snapshot.forEach((doc) => {
                if(doc.data() !== null)
				    allFaculties.push(doc.data());
			});
			return allFaculties;
		},
		faculty: async (parent, args) => {
			let myFaculty;
			await facultiesRef
				.where('id', '==', args.id)
				.get()
				.then((result) => result.forEach((doc) => (myFaculty = doc.data())));
			return myFaculty;
		},
		courses: () => courses,
		course: (parent, args) => {
			return courses.find((course) => course.courseCode === args.courseCode);
		},
		departments:  async () => {
			let allDepartments = [];
			const snapshot = await departmentsRef.get();
			await snapshot.forEach((doc) => {
				allDepartments.push(doc.data());
			});
			return allDepartments;
		},
		course: (parent, args) => {
			return courses.find((department) => department.courseCode === args.courseCode);
		}
	},
	Mutation: {
		newFaculty: async (parent, args) => {
			let length = await facultiesRef.get().then((result) => result.size);
			const faculty = {
				id: String(length+1),
				name: args.name,
				department: args.department
			};
			facultiesRef.add(faculty);
			return faculty;
		},
		updateFaculty: () => {},
		deleteFaculty: () => {}
	}
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log('Faculties server ready at ', url);
});
