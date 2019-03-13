describe('Contacts', () => {
  const mockContactRepository = {
    delete: id => null
  }

  const mockWithStatusCode = jest.fn()
  const mockResponseUtil = {
    withStatusCode: (stat, fn) => mockWithStatusCode
  }

  const mockParseWith = jest.fn()

  jest.mock('aws-sdk/clients/dynamodb', () => ({
    DocumentClient: jest.fn()
  }))
  jest.mock('../../repositories/contact.repository.js', () => ({
    ContactRepository: jest.fn(() => mockContactRepository)
  }))
  jest.mock('../../utils/response.util.js', () => mockResponseUtil)

  describe('delete handler', () => {
    const {
      handler
    } = require('./delete')

    beforeEach(() => {
      jest.resetAllMocks()
      mockWithStatusCode.mockImplementation(() => ({
        statusCode: 204
      }))
    })

    it('should delete a contact', async () => {
      jest.spyOn(mockContactRepository, 'delete').mockResolvedValue('1')

      const id = '1'

      const event = {
        pathParameters: {
          id
        }
      }

      const expectedResponse = {
        statusCode: 204
      }

      const response = await handler(event)

      expect(response).toEqual(expectedResponse)
      expect(mockContactRepository.delete).toHaveBeenCalledWith(id)
    })
  })
})
