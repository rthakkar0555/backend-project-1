class ApiRespons {
  constructor(
      satatsCode,
      data,
      message="Success"
  ){
    this.satatsCode=satatsCode
    this.data=data
    this.message=message
    this.success=satatsCode < 400
  }
}