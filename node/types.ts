export interface Minicart {
  buyer: Buyer
  shipping: Shipping
  items: Item[]
  listRegistry?: ListRegistry
}

interface Buyer {
  id: string
  firstName: string
  lastName: string
  document: string
  documentType: string
  email: string
  phone: string
  address: Address
}

interface Shipping {
  value: number
  estimatedDate: string
  address: Address
}

interface Item {
  id: string
  name: string
  price: number
  quantity: number
  deliveryType: string
  deliverySlaInMinutes: number
  categoryId: number
  categoryName: string
  discount: string
  sellerId: string
  taxValue: number
}

interface ListRegistry {
  name: string
  deliveryToOwner: boolean
}

export interface Payments {
  id: string
  method: string
  name: string
  value: number
  currencyIso4217: string
  installments: number
  details: PaymentsDetails
}

interface PaymentsDetails {
  bin: string
  lastDigits: string
  holder: string
}

interface Address {
  country: string
  street: string
  number: string
  complement: string
  neighborhood: string
  postalCode: string
  city: string
  state: string
}
