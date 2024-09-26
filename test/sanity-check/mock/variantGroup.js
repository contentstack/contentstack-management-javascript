const createVariantGroup = {
    "name": "Colors",
    "content_types": [
      "multi_page"
    ],
    "uid": "iphone_color_white", 
  }

const createVariantGroup1 = {
    "created_by": "created_by_uid",
    "updated_by": "updated_by_uid",
    "created_at": "2022-10-26T06:52:20.073Z",
    "updated_at": "2023-09-25T04:55:56.549Z",
    "uid": "uid11",
    "name": "iPhone Colors",
    "content_types": [
      "multi_page"
    ],
    "source" : "Personalize"
  }
const createVariantGroup2 = {
    count: 2,
    variant_groups: [
      {
        "uid": "uid21",
        "name": "iPhone Colors",
        "created_by": "created_by_uid",
        "updated_by": "updated_by_uid",
        "created_at": "2022-10-26T06:52:20.073Z",
        "updated_at": "2023-09-25T04:55:56.549Z",
        "content_types": [
          "multi_page"
        ],
        "variant_count": 1,
        "variants": [
          {
            "created_by": "created_by_uid",
            "updated_by": "updated_by_uid",
            "created_at": "2022-10-26T06:52:20.073Z",
            "updated_at": "2023-09-25T04:55:56.549Z",
            "uid": "iphone_color_white",
            "name": "White"
          }
        ]
      },
      {
        "uid": "uid22",
        "name": "iPhone",
        "created_by": "created_by_uid",
        "updated_by": "updated_by_uid",
        "created_at": "2022-10-26T06:52:20.073Z",
        "updated_at": "2023-09-25T04:55:56.549Z",
        "content_types": [
          "iphone_prod_desc"
        ],
        "variant_count": 1,
        "variants": [
          {
            "created_by": "created_by_uid",
            "updated_by": "updated_by_uid",
            "created_at": "2022-10-26T06:52:20.073Z",
            "updated_at": "2023-09-25T04:55:56.549Z",
            "uid": "iphone_color_white",
            "name": "White"
          }
        ]
      }
    ],
    ungrouped_variants: [
          {
            "created_by": "created_by_uid",
            "updated_by": "updated_by_uid",
            "created_at": "2022-10-26T06:52:20.073Z",
            "updated_at": "2023-09-25T04:55:56.549Z",
            "uid": "iphone_color_red",
            "name": "Red"
          }
    ],
    ungrouped_variant_count: 1
  }

export { createVariantGroup, createVariantGroup1, createVariantGroup2 }
