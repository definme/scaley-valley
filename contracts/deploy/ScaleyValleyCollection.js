module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const deployResult = await deploy('ScaleyValleyCollection', {
    from: deployer,
    log: true,
    args: ['https://api-scaley-valley.definme.com/metadata'],
  })

  console.log('Collection address: ', deployResult.address)
}

module.exports.tags = ['ScaleyValleyCollection']
