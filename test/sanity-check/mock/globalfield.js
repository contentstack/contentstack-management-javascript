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
  global_field: {
    title: "Nested Global Field",
    uid: "nested_global_field222",
    description: "",
    schema: [
      {
        data_type: "text",
        display_name: "Single Line Textbox",
        uid: "single_line",
        field_metadata: {
          description: "",
          default_value: "",
          version: 3,
        },
        format: "",
        error_messages: {
          format: "",
        },
        mandatory: false,
        multiple: false,
        non_localizable: false,
        unique: false,
        indexed: false,
        inbuilt_model: false,
      },
      {
        data_type: "global_field",
        display_name: "Global",
        reference_to: "first",
        field_metadata: {
          description: "",
        },
        uid: "global_field",
        mandatory: false,
        multiple: false,
        non_localizable: false,
        unique: false,
        indexed: false,
        inbuilt_model: false,
      },
    ],
    referred_content_types: [
      {
        uid: "first",
        title: "First",
      },
    ],
    global_field_refs: [
      {
        uid: "first",
        occurrence_count: 3,
        isChild: true,
        paths: ["schema.1", "schema.3.schema.4", "schema.4.blocks.0.schema.2"],
      },
      {
        uid: "first",
        occurrence_count: 1,
        isChild: false,
      },
    ],
  },
};

export { createGlobalField, createNestedGlobalField };
