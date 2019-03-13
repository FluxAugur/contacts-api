describe('Contacts', () => {
  const mockContactRepository = {
    list: () => []
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

  describe('list handler', () => {
    const {
      handler
    } = require('./list')

    beforeEach(() => {
      jest.resetAllMocks()
      mockWithStatusCode.mockImplementation((data) => ({
        statusCode: 200,
        body: JSON.stringify(data)
      }))
    })

    it('should return a list of contacts', async () => {
      jest.spyOn(mockContactRepository, 'list').mockResolvedValue(testContacts)

      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify(testContacts)
      }

      const response = await handler({})

      expect(response).toBeDefined()
      expect(response).toEqual(expectedResponse)
      expect(mockContactRepository.list).toHaveBeenCalled()
      expect(mockWithStatusCode).toHaveBeenCalled()
    })
  })
})
