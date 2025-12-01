import cloneDeep from 'lodash/cloneDeep'
import {
  update,
  deleteEntity,
  fetch,
  query,
  create
} from '../../entity'
/**
 * Labels allow you to group a collection of content within a stack. Using labels you can group content types that need to work together. Read more about <a href='https://www.contentstack.com/docs/developers/create-content-types/manage-labels'>Labels</a>.
 * @namespace Label
 */
export function Label (http, data) {
  this.stackHeaders = data.stackHeaders
  this.urlPath = `/labels`

  if (data.label) {
    Object.assign(this, cloneDeep(data.label))
    this.urlPath = `/labels/${this.uid}`
    /**
     * @description The Update label call is used to update an existing label.
     * @memberof Label
     * @func update
     * @returns {Promise<Label>} Promise for Label instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).label('label_uid').fetch()
     * .then((label) => {
     *  label.name = 'My New Label'
     *  return label.update()
     * })
     * .then((label) => console.log(label))
     *
     */
    this.update = update(http, 'label')

    /**
     * @description The Delete label call is used to delete a specific label.
     * @memberof Label
     * @func delete
     * @returns {Promise<Object>} Response Object.
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).label('label_uid').delete()
     * .then((response) => console.log(response.notice))
     */
    this.delete = deleteEntity(http)

    /**
     * @description The fetch Label returns information about a particular label of a stack.
     * @memberof Label
     * @func fetch
     * @returns {Promise<Label>} Promise for Label instance
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack({ api_key: 'api_key'}).label('label_uid').fetch()
     * .then((label) => console.log(label))
     *
     */
    this.fetch = fetch(http, 'label')
  } else {
    /**
     * @description The Create a label call creates a new label in a particular stack of your Contentstack account.
     * @memberof Label
     * @func create
     * @returns {Promise<Label>} Promise for Label instance
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     * const label = {
     *  name: 'First label',
     *  content_types: [singlepageCT.content_type.uid]
     * }
     * client.stack().label().create({ label })
     * .then((label) => console.log(label))
     */
    this.create = create({ http })

    /**
     * @description The Query on Label will allow you to fetch details of all or specific Labels.
     * @memberof Label
     * @param {Object} params - URI parameters
     * @prop {Object} params.query - Queries that you can use to fetch filtered results.
     * @func query
     * @returns {Object} Query builder object with find(), count(), and findOne() methods.
     *
     * @example
     * import * as contentstack from '@contentstack/management'
     * const client = contentstack.client()
     *
     * client.stack().label().query({ query: { name: 'Label Name' } }).find()
     * .then((label) => console.log(label))
     */
    this.query = query({ http: http, wrapperCollection: LabelCollection })
  }
}

export function LabelCollection (http, data) {
  const obj = cloneDeep(data.labels) || []
  const labelCollection = obj.map((userdata) => {
    return new Label(http, { label: userdata, stackHeaders: data.stackHeaders })
  })
  return labelCollection
}
