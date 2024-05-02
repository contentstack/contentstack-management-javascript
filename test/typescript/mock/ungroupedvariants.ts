const variant = {
    "created_by": "blt6cdf4e0b02b1c446",
    "updated_by": "blt303b74fa96e1082a",
    "created_at": "2022-10-26T06:52:20.073Z",
    "updated_at": "2023-09-25T04:55:56.549Z",
    "uid": "iphone_color_white",
    "name": "White"
  }

const variants1 = {
          "uid": "iphone_color_white", // optional
          "name": "White",
          "personalize_metadata": {
             "experience_uid": "exp1",
              "experience_short_uid": "expShortUid1",
               "project_uid": "project_uid1",
              "variant_short_uid": "variantShort_uid1"
          },
    }
const variants2 = {
    "uid": "variant_1",
    "created_by": "user_id",
    "updated_by": "user_id",
    "name": "Variant 1",
    "personalize_metadata": {
          "experience_uid": "exp1",
          "experience_short_uid": "expShortUid1",
          "project_uid": "project_uid1",
          "variant_short_uid": "variantShort_uid1"
    },
    "created_at": "2024-04-16T05:53:50.547Z",
    "updated_at": "2024-04-16T05:53:50.547Z",
    "variant_group": {
        "uid": "variant_group_1",
        "name": "Variant Group 1",
        "content_types": [
            "CTSTAET123"
        ],
        "personalize_metadata": {
            "experience_uid": "variant_group_ex_uid",
            "experience_short_uid": "variant_group_short_uid",
            "project_uid": "variant_group_project_uid"
        }
    }
}



export { variant, variants1, variants2 }