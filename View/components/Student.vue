<template>
    <div class="wrapper">
        <section class="hero is-link">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        {{student.name}}
                    </h1>
                    <h2 class="subtitle">
                        {{student.email}}
                    </h2>
                </div>
            </div>
        </section>
        <scale-loader v-if="isLoading" color="#448aff" style="height: 90vh;"></scale-loader>
        <md-tabs v-else>
            <md-tab md-label="événements">
                <md-empty-state
                    v-if="student.studentEvents <= [0]"
                    md-icon="event"
                    md-label="Aucun événement"
                    md-description="L'étudiant ne participe à aucun événement."
                    class="tabsIsEmpty">
                </md-empty-state>
                <div v-else class="md-layout papa">
                    <div v-for="(event, key) in student.studentEvents" class="enfant">
                        <router-link :to="{name: 'event', params: {id: event.id}}" :href="`/event/${event.id}`" class="contenu">
                            <md-card class="md-primary" md-with-hover>
                                <md-ripple>
                                    <md-card-header>
                                        <div class="md-title">{{event.courseName}}</div>
                                        <div class="md-subhead">{{event.academicYear}}</div>
                                    </md-card-header>
                                </md-ripple>
                            </md-card>
                        </router-link>
                    </div>
                </div>
            </md-tab>
            <md-tab md-label="implémentations">
                <md-empty-state
                    v-if="student.implementations <= [0]"
                    md-icon="computer"
                    md-label="Aucunne implémentation"
                    md-description="L'étudiant n'a aucune implémentation."
                    class="tabsIsEmpty">
                </md-empty-state>
                <div v-else class="md-layout papa">
                    <div v-for="(implementation, key) in student.implementations" class="enfant">
                        <md-card class="md-primary" md-with-hover>
                            <md-ripple>
                                <md-card-header>
                                    <div class="md-title">{{implementation.project.name}} du <span v-for="event in implementation.events">{{event.courseName}} de {{event.academicYear}}</span></div>
                                    <div class="md-subhead">Pondération de {{implementation.weight}}</div>
                                </md-card-header>

                                <md-card-content>
                                    <p>{{implementation.project.description}}</p>
                                </md-card-content>

                                <md-card-actions>
                                    <a :href="implementation.urlRepo"  v-if="implementation.urlRepo">
                                        <md-button>
                                            Github
                                        </md-button>
                                    </a>
                                    <a :href="implementation.urlProject"  v-if="implementation.urlProject">
                                        <md-button>
                                            Siteweb
                                        </md-button>
                                    </a>
                                    <md-button @click.prevent="showModifyModal = true; setModifyData(implementation)">Modifier</md-button>
                                </md-card-actions>
                            </md-ripple>
                        </md-card>
                    </div>
                </div>
            </md-tab>
        </md-tabs>
        <md-dialog v-if="showModifyModal" :md-active.sync="showModifyModal" >
            <md-dialog-title>
                Modification la pondération du projet {{modalItem.name}}
            </md-dialog-title>
            <md-tabs md-dynamic-height>
                <md-tab md-label="Modifier">
                    <template>
                        <md-field>
                            <label for="weight">Pondération du projet</label>
                            <md-input type="number" :value="modalItem.weight" id="weight" name="weight" step="0.1"></md-input>
                            <span class="md-helper-text">La pondération doit être un nombre entre 0 et 1</span>
                        </md-field>
                        <md-field>
                            <label for="urlRepo">Github url</label>
                            <md-input name="urlRepo" id="urlRepo" placeholder="Écrivez l'url du repository" :value="modalItem.urlRepo" />
                        </md-field>
                        <md-field>
                            <label for="urlProject">Projet url</label>
                            <md-input name="urlProject" id="urlProject" placeholder="Écrivez l'url du projet" :value="modalItem.urlProject" />
                        </md-field>
                    </template>
                </md-tab>
            </md-tabs>
            <md-dialog-actions class="md-dialog-title md-title">
                <md-button @click.prevent="modifyImplementation(modalItem.id)" class="md-raised md-primary">
                    Sauvegarder les modifications
                </md-button>
                <md-button @click.prevent="showModifyModal = false" class="md-accent">
                    Annuler           
                </md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import {Bus} from '../Bus'
import { STUDENT_QUERY } from '../constants/Student.gql'
import { USER_QUERY } from '../constants/User.gql'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
export default {
    name: 'student',
    props: ['id'],
    components: {
        ScaleLoader,
    },
    data(){
        return{
            student: [],
            currentUser: {},
            showModifyModal: false,
            isLoading: 0,   
        }
    },
    computed: {
        ...mapGetters([
            'modalItem',
            'userId'
        ])
    },  
    apollo: {
        student: {
            query: STUDENT_QUERY,
            variables() {
                return {
                    id: this.id,
                }
            },
            update(data){
                return data.Student
            },
            loadingKey: 'isLoading',
        },
        currentUser: {
            query: USER_QUERY,
            variables() {
                // Use vue reactive properties
                return {
                    id: this.userId,
                }
            },
            update(data){
                return data.User
            }
        }
    },
    methods: {
        ...mapMutations([
            'setModifyData'
        ]),
        modifyImplementation(implementationId){
            let id = implementationId;
            let weight = parseFloat(document.getElementById("weight").value),
                urlProject = document.getElementById("urlProject").value,
                urlRepo = document.getElementById("urlRepo").value;
            let studentId = this.id

            Bus.$emit('modifyImplementation', { id, weight, studentId, urlRepo, urlProject });

            // Close the modify modal
            this.showModifyModal = false;
        }, 
    }
}
</script>
