const createGlobalField = {
  global_field: {
    title: "First",
    uid: "first",
    schema: [
      {
        display_name: "Name",
        uid: "name",
        data_type: "text",
      },
      {
        data_type: "text",
        display_name: "Rich text editor",
        uid: "description",
        field_metadata: {
          allow_rich_text: true,
          description: "",
          multiline: false,
          rich_text_type: "advanced",
          options: [],
          version: 3,
        },
        multiple: false,
        mandatory: false,
        unique: false,
      },
    ],
  },
};

const createNestedGlobalField = {
  "global_field": {
      "title": "Nested Global Fields9",
      "uid": "nested_global_field9",
      "schema": [
          {
              "data_type": "text",
              "display_name": "Single Line Textbox",
              "uid": "single_line"
          },
          {
              "data_type": "global_field",
              "display_name": "Global",
              "uid": "global_field",
              "reference_to": "nested_global_field33"
          }
      ]
  }
}

const createNestedGlobalFieldForReference = {
  "global_field": {
      "title": "nested global field for reference",
      "uid": "nested_global_field33",
      "schema": [
          {
              "data_type": "text",
              "display_name": "Single Line Textbox",
              "uid": "single_line"
          },
          {
              "data_type": "global_field",
              "display_name": "Global",
              "uid": "global_field",
              "reference_to": "first"
          }
      ]
  }
}

export { createGlobalField, createNestedGlobalField, createNestedGlobalFieldForReference };
