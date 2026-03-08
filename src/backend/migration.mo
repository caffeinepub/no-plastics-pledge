import Map "mo:core/Map";

module {
  type Pledge = {
    certificateId : Text;
    timestamp : Int;
    name : Text;
    email : Text;
  };

  type OldActor = {
    pledgesMap : Map.Map<Text, Pledge>;
    counter : Nat;
  };

  type NewActor = {
    pledgesMap : Map.Map<Text, Pledge>;
    counter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
