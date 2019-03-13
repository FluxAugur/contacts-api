describe('Contacts', () => {
  const mockContactRepository = {
    get: id => null
  }

  const testContacts = [{
      "id": "1",
      "name": {
        "honorific": "Mr",
        "givenName": "Luke",
        "familyName": "Skywalker"
      },
      "communication": {
        "email": {
          "user": "luke",
          "domain": "tattoine.planet"
        },
        "phone": {
          "country": 1,
          "area": 423,
          "no": 5551234
        },
        "address": {
          "street1": "456 Some Other Street",
          "city": "Johnson City",
          "state": "TN",
          "zip": 37604,
          "county": "Washington"
        }
      }
    },
    {
      "id": "2",
      "name": {
        "givenName": "Jin",
        "familyName": "Erso",
        "suffix": "III"
      },
      "communication": {
        "phone": {
          "country": 1,
          "area": 206,
          "no": 8675309,
          "ext": 123
        },
        "email": {
          "user": "jinerso",
          "domain": "death.star",
          "tld": "star"
        },
        "website": {
          "domain": "death.star",
          "tld": "star"
        }
      },
      "address": {
        "street1": "123 Some Street",
        "street2": "Apt 456",
        "city": "Asheville",
        "state": "NC",
        "zip": 87465,
        "county": "Buncombe"
      }
    }
  ]

  const mockWithStatusCode = jest.fn()
  const mockResponseUtil = {
    withStatusCode: (stat, fn) => mockWithStatusCode
  }

  const mockParseWith = jest.fn()

  jest.mock('aws-sdk/clients/dynamodb', () => ({
    DocumentClient: jest.fn()
  }))
  jest.mock('../../repositories/contact.repository', () => ({
    ContactRepository: jest.fn(() => mockContactRepository)
  }))
  jest.mock('../../utils/response.util', () => mockResponseUtil)

  describe('get handler', () => {
    const {
      handler
    } = require('./get')

    beforeEach(() => {
      jest.resetAllMocks()
      mockWithStatusCode.mockImplementation((data) => ({
        statusCode: 200,
        body: JSON.stringify(data)
      }))
    })

    it('should get a contact by id', async () => {
      jest.spyOn(mockContactRepository, 'get').mockImplementation(id => Promise.resolve(testContacts[id] || null))

      const id = 1
      const event = {
        pathParameters: {
          id
        }
      }

      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify(testContacts[id])
      }

      const response = await handler(event)

      expect(response).toEqual(expectedResponse)
      expect(mockContactRepository.get).toHaveBeenCalledWith(id)
      expect(mockWithStatusCode).toHaveBeenCalled()
    })

    it('should return a 404 not found if a contact does not exist', async () => {
      jest.spyOn(mockContactRepository, 'get').mockResolvedValue(null)

      mockWithStatusCode.mockClear()
      mockWithStatusCode.mockImplementation(_ => ({
        statusCode: 404
      }))

      const id = 1000
      const event = {
        pathParameters: {
          id
        }
      }

      const expectedResponse = {
        statusCode: 404
      }

      const response = await handler(event)

      expect(response).toEqual(expectedResponse)
      expect(mockContactRepository.get).toHaveBeenCalledWith(id)
      expect(mockWithStatusCode).toHaveBeenCalled()
    })
  })
})
