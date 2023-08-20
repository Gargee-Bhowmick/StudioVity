const dummy = async (req, res) => {
    try {
      res.status(200).send("This is a dummy endpoint");
    } catch (error) {
      res.status(200).send({message:"Error in dummy endpoint", data:error});
    }
  };
  
  module.exports = dummy;