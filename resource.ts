import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const newSchema = a.schema({
  Contract: a
    .model({
      id: a.integer().required(),
      doc_id: a.string().required(),
      file_name: a.string().required(),
      client_id: a.string().required(), // partition key for index
      status: a.string().required(), // sort key for index
      sub_id: a.string().required(),
      file_id: a.string().required(),
      mime_type: a.string().required(),
      created_by: a.string().required(),
      created_at: a.string().required(),
      last_modified: a.string().required(),
      file_size: a.string().required(),

      folder_id: a.integer(),
      time: a.string(),
      pre_status: a.string(),
      validate_count: a.integer().default(1),
    })
    .identifier(["id"])
    .secondaryIndexes((index) => [
      index("client_id")
        .sortKeys(["status"])
        .queryField("contractsByClientStatus"),
    ])
    .authorization((allow) => [
      allow.authenticated().to(["read", "create", "update", "delete"]),
      allow.groups(["admin"]).to(["read", "create", "update", "delete"]),
    ]),

  EditHistory: a
    .model({
      edit_id: a.string().required(),
      last_modified: a.string().required(),
      file_name: a.string().required(),
      client_id: a.string().required(),
      sub_id: a.string().required(),
      field_name: a.string().required(),
      old_value: a.string().required(),
      new_value: a.string().required(),
      edit_comment: a.string().required(),
      edited_by: a.string().required(),
    })
    .identifier(["edit_id", "last_modified"])
    .authorization((allow) => [
      allow.authenticated().to(["read", "create", "update", "delete"]),
      allow.groups(["admin"]).to(["read", "create", "update", "delete"]),
    ]),

  Folders: a
    .model({
      id: a.integer().required(),
      name: a.string().required(),
      created_by: a.string().required(),
      parent_folder_id: a.integer().required(),
      path: a.string(),
      created_at: a.string().required(),
    })
    .identifier(["id"])
    .authorization((allow) => [
      allow.authenticated().to(["read", "create", "update", "delete"]),
      allow.groups(["admin"]).to(["read", "create", "update", "delete"]),
    ]),

  InstructionFile: a
    .model({
      id: a.integer().required(),
      doc_id: a.string().required(),
      file_name: a.string().required(),
      client_id: a.string().required(),
      sub_id: a.string().required(),
      file_id: a.string().required(),
      mime_type: a.string().required(),
      created_by: a.string().required(),
      created_at: a.string().required(),
      last_modified: a.string().required(),
      status: a.string().required(),
      pre_status: a.string(),
      file_size: a.string().required(),
      folder_id: a.integer(),
      time: a.string(),
    })
    .identifier(["id"])
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(["read", "create", "update", "delete"]),
      allow.groups(["admin"]).to(["read", "create", "update", "delete"]),
    ]),

  PlaybookFile: a
    .model({
      id: a.integer().required(),
      doc_id: a.string().required(),
      file_name: a.string().required(),
      client_id: a.string().required(),
      sub_id: a.string().required(),
      file_id: a.string().required(),
      mime_type: a.string().required(),
      created_by: a.string().required(),
      created_at: a.string().required(),
      last_modified: a.string().required(),
      status: a.string().required(),
      pre_status: a.string(),
      file_size: a.string().required(),
      folder_id: a.integer(),
      time: a.string(),
    })
    .identifier(["id"])
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(["read", "create", "update", "delete"]),
      allow.groups(["admin"]).to(["read", "create", "update", "delete"]),
    ]),

  Users: a
    .model({
      id: a.integer().required(),
      name: a.string().required(),
      email_id: a.string().required(),
      user_id: a.string().required(),
      contact_number: a.string().required(),
      user_role: a.string().required(),
      cognito_user_id: a.string().required(),
      created_at: a.string().required(),
      last_login: a.string(),
      is_active: a.boolean().default(true),
    })
    .identifier(["id"])
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["admin"]).to(["read", "create", "update", "delete"]),
    ]),
});

const schema = newSchema;

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // AWS_IAM is automatically enabled - Lambda can use temporary credentials
    // No API key needed when using IAM authentication
  },
});
