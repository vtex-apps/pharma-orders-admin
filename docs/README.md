### Configure

Crear la entidad y el schema:

`[PUT]`

`https://:workspace.vtexcommercestable.com.br/api/dataentities/pharmaOrders/schemas/pharma-orders`

`HEADER: VtexIdClientAutCookie`

`BODY:`

```json
{
  "properties": {
    "orderId": {
      "type": "string",
      "maxLength": 50,
      "title": "orderId"
    },
    "status": {
      "type": "string",
      "maxLength": 50,
      "title": "status"
    },
    "invoiceNumber": {
      "type": "string",
      "maxLength": 50,
      "title": "invoiceNumber"
    }
  },
  "required": ["orderId", "status", "invoiceNumber"],
  "v-indexed": ["orderId", "status", "invoiceNumber"],
  "v-security": {
    "publicJsonSchema": true,
    "allowGetAll": false,
    "publicRead": ["orderId", "status", "invoiceNumber"],
    "publicWrite": ["orderId", "status", "invoiceNumber"],
    "publicFilter": ["orderId", "status", "invoiceNumber"]
  }
}
```

Configurar el orders-broadcast para redirigir el feed de ordenes al workspace donde se este trabajando
`https://:workspace-.myvtex.com/admin/apps/vtex.orders-broadcast/setup`

Ingresar el id de la categoria de Medicamentos
`https://:workspace--:account.myvtex.com/admin/apps/vtexarg.pharma-orders-admin/setup`

`https://pharmaorders--gbonacchi.myvtex.com/admin/apps/vtexarg.pharma-orders-admin/setup`
