
import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import { encrypt } from '../crypto'
import * as validator from 'validator'

interface User {
  id: string
}

interface EventData {
  email: string
  password: string
  name: string
  company: string
  isAdmin: boolean
  softDelete: boolean
}

const SALT_ROUNDS = 10

export default async (event: FunctionEvent<EventData>) => {

  try {
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { email, password, name, company, isAdmin, softDelete } = event.data

    if (!validator.isEmail(email)) {
      return { error: 'L\'adresse email est invalide' }
    }

    // check if user exists already
    const userExists: boolean = await getUser(api, email)
      .then(r => r.User !== null)
    if (userExists) {
      return { error: 'Cette adresse email est déjà utilisé' }
    }

    // create password hash
    // const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    // const hash = await bcrypt.hash(password, salt)
    const hash = encrypt(password);

    // create new user
    const userId = await createGraphcoolUser(api, email, hash, name, company, isAdmin, softDelete)

    // generate node token for new User node
    const token = await graphcool.generateNodeToken(userId, 'User')

    return { data: { id: userId, token } }
  } catch (e) {
    return { error: 'An unexpected error occured during signup.' }
  }
}

async function getUser(api: GraphQLClient, email: string): Promise<{ User }> {
  const query = `
    query getUser($email: String!) {
      User(email: $email) {
        id
      }
    }
  `

  const variables = {
    email,
  }

  return api.request<{ User }>(query, variables)
}

async function createGraphcoolUser(api: GraphQLClient, email: string, password: string, name: string, company: string, isAdmin: boolean, softDelete: boolean): Promise<string> {
  const mutation = `
    mutation createGraphcoolUser($email: String!, $password: String!, $name: String!, $company: String, $isAdmin: Boolean!, $softDelete: Boolean!) {
      createUser(
        email: $email,
        password: $password,
        name: $name,
        company: $company,
        softDelete: $softDelete,
        isAdmin: $isAdmin
      ) {
        id
      }
    }
  `

  const variables = {
    email,
    password: password,
    name: name,
    company: company,
    softDelete: softDelete,
    isAdmin: isAdmin
  }

  return api.request<{ createUser: User }>(mutation, variables)
    .then(r => r.createUser.id)
}