describe('Contacts', () => {
  const mockContactRepository = {
    get: id => null,
    put: contact => null
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
  jest.mock('../../repositories/contact.repository.js', () => ({
    ContactRepository: jest.fn(() => mockContactRepository)
  }))
  jest.mock('../../utils/response.util.js', () => mockResponseUtil)
  jest.mock('../../utils/request.util.js', () => mockRequestUtil)

  describe('update handler', () => {
    const {
      handler
    } = require('./update')

    beforeEach(() => {
      jest.resetAllMocks()
      mockParseWith.mockImplementation(text => JSON.parse(text))
    })

    it('should create a new contact', async () => {
      jest.spyOn(mockContactRepository, 'put').mockImplementation((data) => Promise.resolve(data))
      jest.spyOn(mockContactRepository, 'get').mockResolvedValue({
        id: '3'
      })

      mockWithStatusCode.mockImplementation((data) => ({
        statusCode: 200,
        body: JSON.stringify(data)
      }))

      const contact = {
        "id": "3",
        "name": {
          "givenName": "Ben",
          "familyName": "Solo"
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
            "street1": "789 Some Other Other Street",
            "street2": "Apt 10"
          }
        }
      }

      const event = {
        pathParameters: {
          id: '3'
        },
        body: JSON.stringify(contact)
      }

      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify(contact)
      }

      const response = await handler(event)

      expect(response).toEqual(expectedResponse)
      expect(mockContactRepository.put).toHaveBeenCalledWith(contact)
      expect(mockContactRepository.get).toHaveBeenCalledWith('3')
    })

    it('should return 404 not found if contact does not exist', async () => {
      jest.spyOn(mockContactRepository, 'put').mockRejectedValue('unexpected call to put')
      jest.spyOn(mockContactRepository, 'get').mockResolvedValue(null)

      mockWithStatusCode.mockImplementation(() => ({
        statusCode: 404
      }))

      const contact = {
        "id": "3",
        "name": {
          "givenName": "Ben",
          "familyName": "Solo"
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
            "street1": "789 Some Other Other Street",
            "street2": "Apt 10"
          }
        }
      }

      const event = {
        pathParameters: {
          id: '3'
        },
        body: JSON.stringify(contact)
      }

      const expectedResponse = {
        statusCode: 404
      }

      const response = await handler(event)

      expect(response).toEqual(expectedResponse)
      expect(mockContactRepository.get).toHaveBeenCalledWith('3')

      expect(mockContactRepository.put).not.toHaveBeenCalledWith(contact)
    })

    it('should return 400 bad request if contact id does not match', async () => {
      jest.spyOn(mockContactRepository, 'put').mockRejectedValue('unexpected call to put')
      jest.spyOn(mockContactRepository, 'get').mockResolvedValue({
        id: '1000'
      })

      mockWithStatusCode.mockImplementation(() => ({
        statusCode: 400
      }))

      const contact = {
        "id": "3",
        "name": {
          "givenName": "Ben",
          "familyName": "Solo"
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
            "street1": "789 Some Other Other Street",
            "street2": "Apt 10"
          }
        }
      }

      const event = {
        pathParameters: {
          id: '3'
        },
        body: JSON.stringify(contact)
      }

      const expectedResponse = {
        statusCode: 400
      }

      const response = await handler(event)

      expect(response).toEqual(expectedResponse)
      expect(mockContactRepository.get).toHaveBeenCalledWith('3')

      expect(mockContactRepository.put).not.toHaveBeenCalledWith(contact)
    })
  })
})
