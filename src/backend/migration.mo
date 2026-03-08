import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  type Pledge = {
    certificateId : Text;
    timestamp : Time.Time;
    name : Text;
    email : Text;
  };

  type Certificate = {
    id : Text;
    name : Text;
    timestamp : Time.Time;
  };

  // Old actor type without counter field
  type OldActor = {
    pledgesMap : Map.Map<Text, Pledge>;
    maxResponseLength : Nat;
  };

  // New types with counter field
  type NewActor = {
    pledgesMap : Map.Map<Text, Pledge>;
    maxResponseLength : Nat;
    var counter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    { old with var counter = 0 : Nat };
  };
};
