describe('Contacts', () => {
  const mockContactRepository = {
    list: () => [],
    put: contact => null,
  }

  const mockWithStatusCode = jest.fn()
  const mockResponseUtil = {
    withStatusCode: (stat, fn) => mockWithStatusCode
  }

  const mockParseWith = jest.fn()
  const mockRequestUtil = {
    parseWith: (parser) => mockParseWith
  }

  jest.mock('aws-sdk/clients/dynamodb', () => ({
    DocumentClient: jest.fn()
  }))
  jest.mock('../../repositories/contact.repository', () => ({
    ContactRepository: jest.fn(() => mockContactRepository)
  }))
  jest.mock('../../utils/response.util', () => mockResponseUtil)
  jest.mock('../../utils/request.util', () => mockRequestUtil)

  describe('add handler', () => {
    const {
      handler
    } = require('./add')

    beforeEach(() => {
      jest.resetAllMocks()
      mockWithStatusCode.mockImplementation((data) => ({
        statusCode: 201
      }))
      mockParseWith.mockImplementation(text => JSON.parse(text))

    })

    it('should create a new contact', async () => {
      jest.spyOn(mockContactRepository, 'put').mockImplementation((data) => Promise.resolve(data))

      const contact = {
        "id": "3",
        "name": {
          "givenName": "Kylo",
          "familyName": "Ren"
        },
        "communication": {
          "phone": {
            "area": 423,
            "country": 1,
            "no": 5557413
          },
          "address": {
            "zip": 98004,
            "state": "WA",
            "city": "Bellevue",
            "street1": "789 Some Other Other Street"
          }
        }
      }

      const event = {
        body: JSON.stringify(contact)
      }

      const expectedResponse = {
        statusCode: 201
      }

      const response = await handler(event)

      expect(response).toEqual(expectedResponse)
      expect(mockContactRepository.put).toHaveBeenCalledWith(contact)
    })
  })
})
