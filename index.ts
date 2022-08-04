import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { Lens } from 'monocle-ts'

import { faker } from '@faker-js/faker'


const logM = (message: string) => (arg: unknown) => console.log(message, arg)

const Address = t.strict({
  streetAddress: t.string,
  city: t.string,
  state: t.string,
  zipCode: t.string,
  country: t.string
})

const Company = t.strict({
  address: Address,
  name: t.string
})

const Employee = t.strict({
  company: Company,
  name: t.string
})

type Address = t.TypeOf<typeof Address>
type Company = t.TypeOf<typeof Company>
type Employee = t.TypeOf<typeof Employee>

const CompanyL = Lens.fromProp<Employee>()('company')
const AddressL = Lens.fromProp<Company>()('address')
const CountryL = Lens.fromProp<Address>()('country')

const capitalize = (str: string) => str.toUpperCase()

const address = (): Address => ({
  streetAddress: faker.address.streetAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
  zipCode: faker.address.zipCode(),
  country: faker.address.country()
})

const company = (): Company => ({ name: 'company', address: address() })

const employee = (): Employee => ({
  name: `${faker.name.firstName().toLowerCase()} ${faker.name.lastName().toLowerCase()}`,
  company: company()
})

pipe(
  employee(),
  /**
    employee => ({
      ...employee,
      company: {
        ...employee.company,
        address: {
          ...employee.company.address,
          country: capitalize(employee.company.address.country)
        }
      }
    })
   */
  CompanyL.compose(AddressL).compose(CountryL).modify(capitalize),
  logM('Employee')
)
