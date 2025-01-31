import connectMongo from '../../../api-lib/mongodb'
const Config = require('../../../api-lib/models/websiteconfig')

import type { NextApiRequest, NextApiResponse } from 'next'
async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo()
  let { name, email } = req.body
  console.log('deleteProjct', name)
  try {
    let project = await Config.findOneAndDelete({ name: name, owner: email }).clone()

    res.status(200).json('Success')
  } catch (err) {
    console.error(err.message)
    res.status(500).json('Server error')
  }
}

export default handler
