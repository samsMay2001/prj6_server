const startVoiceCall = async (req, res, AudioCall, User) => {
    const from = req.body._id;
    const to = req.body.id;
  
    const from_user = await User.findById(from);
    const to_user = await User.findById(to);
  
    // create a new call audioCall Doc and send required data to client
    const new_audio_call = await AudioCall.create({
      participants: [from, to],
      from,
      to,
      status: "Ongoing",
    });
  
    res.status(200).json({
      data: {
        from: to_user,
        roomID: new_audio_call._id,
        streamID: to,
        userID: from,
        userName: from,
      },
    });
}
module.exports = startVoiceCall; 