import Vue from 'vue'
import { apolloClient }  from './apollo'
import { store } from './store'
import { router } from './router'
import gql from 'graphql-tag'

/*******************
 *   My Graphql query
*******************/

// Users query
import { CREATE_USER_MUTATION } from './constants/UsersCreate.gql'
import { ALL_USER_QUERY } from './constants/UsersAll.gql'

// Students query
import { CREATE_STUDENT_MUTATION } from './constants/StudentsCreate.gql'
import { ALL_STUDENT_QUERY } from './constants/StudentsAll.gql'

// Projects query
import { CREATE_PROJECT_MUTATION } from './constants/ProjectsCreate.gql'
import { ALL_PROJECT_QUERY } from './constants/ProjectsAll.gql'

// Events query
import { CREATE_EVENT_MUTATION } from './constants/EventsCreate.gql'
import { ALL_EVENT_QUERY } from './constants/EventsAll.gql'

// Implementations query
import { CREATE_IMPLEMENTATIONS_MUTATION } from './constants/ImplementationsCreate.gql'

export const Bus = new Vue();


/*******************
 *  Create User
*******************/
Bus.$on('createUser', payload => {
    let { email, password, name, company, isAdmin, softDelete } = payload;

    apolloClient.mutate({
        mutation: CREATE_USER_MUTATION,
        variables: {
            email,
            password,
            name,
            company,
            isAdmin,
            softDelete
        },
        update: (cache, { data: { signupUser }}) => {
            console.log(signupUser)
            console.log('User creation done')
        },
        refetchQueries: [
            {
                query: ALL_USER_QUERY,
            }
        ]
    });
})
/*******************
 *  Create Student
*******************/
Bus.$on('createStudent', payload => {
    let { email, name, softDelete } = payload;

    apolloClient.mutate({
        mutation: CREATE_STUDENT_MUTATION,
        variables: {
            email,
            name,
            softDelete
        },
        update: (cache, { data: { createStudent } }) => {
            console.log(createStudent)
            console.log('Student creation done')
        },
        refetchQueries: [
            {
                query: ALL_STUDENT_QUERY,
            }
        ]
    });
})
/*******************
 *  Create Project
*******************/
Bus.$on('createProject', payload => {
    let { description, name, softDelete } = payload;

    apolloClient.mutate({
        mutation: CREATE_PROJECT_MUTATION,
        variables: {
            description,
            name,
            softDelete
        },
        update: (cache, { data: { createProject } }) => {
            console.log(createProject)
            console.log('Project creation done')
        },
        refetchQueries: [
            {
                query: ALL_PROJECT_QUERY,
            }
        ]
    });
})
/*******************
 *  Create Event
*******************/
Bus.$on('createEvent', payload => {
    let { courseName, academicYear, softDelete, authorId, jurysIds, studentsIds, projectsIds } = payload;

    apolloClient.mutate({
        mutation: CREATE_EVENT_MUTATION,
        variables: {
            courseName,
            academicYear,
            softDelete,
            authorId,
            jurysIds,
            studentsIds,
            projectsIds,
        },
        update: (cache, { data: { createEvent } }) => {
            
            // Get the lastAddedId for implementaiton creation
            store.commit('lastAddedId', createEvent.id)

            console.log(createEvent)
            console.log('Event creation done')
            
            // Looped on students & projects ID
            // for create implementation mutation
            studentsIds.forEach(student => {
                projectsIds.forEach(project => {

                    // Init variable for implementation mutation
                    let weight = 1 / (projectsIds.length),
                        projectId = project,
                        studentsIds = student,
                        softDelete = false,
                        eventId = store.getters.lastAddedId;

                    apolloClient.mutate({
                        mutation: CREATE_IMPLEMENTATIONS_MUTATION,
                        variables: {
                            softDelete,
                            eventId,
                            projectId,
                            studentsIds,
                            weight,
                        },
                        update: (cache, { data: { createImplementation } }) => {
                            console.log(createImplementation)
                            console.log('Implementation creation done')
                        }
                    });
                });
            });
        },
        refetchQueries: [
            {
                query: ALL_EVENT_QUERY,
            }
        ]
    });
})