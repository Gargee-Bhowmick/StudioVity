const saveCb = (saveError, savedEntry) => {
    if (saveError) {
      console.error('Error saving details:', saveError);
      return res.status(200).send({success:false,message:"Error saving details",data:saveError})
    } else {
      console.log('Entry updated and saved successfully:', savedEntry);
    }
  }

  module.exports = saveCb