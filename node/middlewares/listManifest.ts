export async function listManifest(ctx: Context, next: () => Promise<any>) {
  ctx.body = {
    customFields: [
      {
        name: 'Test 1',
        type: 'text',
      },
      {
        name: 'Test select',
        type: 'select',
        options: [
          {
            text: 'Test select 1',
            value: 'Test select 1',
          },
          {
            text: 'Test select 1',
            value: 'Test select 2',
          },
        ],
      },
    ],
  }
  ctx.status = 200
  await next()
}
