<template>
    <div class="wrapper">
        <section class="hero is-link">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        {{user.name}}
                    </h1>
                    <h2 class="subtitle">
                        {{user.company}}
                    </h2>
                </div>
            </div>
        </section>
        <scale-loader v-if="isLoading" color="#448aff" style="height: 90vh;"></scale-loader>
        <md-tabs v-else>
            <md-tab md-label="événements">
                <div class="md-layout papa">
                    <md-empty-state
                        v-if="user.juryEvents <= [0]"
                        md-icon="event"
                        md-label="Aucun événement"
                        md-description="L'utilisateur ne participe à aucun événement."
                        class="tabsIsEmpty">
                    </md-empty-state>
                    <div v-else v-for="(event, key) in user.juryEvents" class="enfant">
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
            <md-tab md-label="meetings">
                    <md-empty-state
                        v-if="user.meetings <= [0]"
                        md-icon="people"
                        md-label="Aucun meeting"
                        md-description="L'utilisateur n'a pas encore de meeting."
                        class="tabsIsEmpty">
                    </md-empty-state>
                <div class="md-layout papa">
                    <div v-for="(meeting, key) in user.meetings" class="enfant">
                        <div class="contenu">
                            <md-card class="md-primary" md-with-hover>
                                <md-ripple>
                                    <md-card-header>
                                        <div class="md-title">{{meeting.student.name}}</div>
                                        <div class="md-subhead">Côte globale de {{meeting.evaluation}}/20</div>
                                    </md-card-header>
                                    <md-card-content>
                                        <p>{{meeting.event.courseName}} de {{meeting.event.academicYear}}</p>
                                        <p>{{meeting.comment}}</p>
                                    </md-card-content>
                                    <md-card-actions>
                                        <md-button @click.prevent="showMeetingModal = true; setModifyData(meeting)">Voir le meeting</md-button>
                                        <md-button @click.prevent="showModifyModal = true; setModifyData(meeting)">Modifier</md-button>
                                    </md-card-actions>
                                </md-ripple>
                            </md-card>
                        </div>
                    </div>
                </div>
            </md-tab>
        </md-tabs>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import { USER_QUERY } from '../constants/User.gql'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
export default {
    name: 'user',
    props: ['id'],
    components: {
        ScaleLoader,
    },
    data(){
        return{
            user: [],
            isLoading: 0,   
        }
    },
    apollo: {
        user: {
            query: USER_QUERY,
            variables() {
                // Use vue reactive properties
                return {
                    id: this.id,
                }
            },
            update(data){
                return data.User
            },
            loadingKey: 'isLoading',
        },
    },
}
</script>
