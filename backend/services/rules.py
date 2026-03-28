def apply_rules(profile, compounds):

    if "headache" in profile.get("symptoms", []):
        compounds["ambroxan"] *= 0.5
        compounds["iso_e_super"] *= 0.6

    if "breathing" in profile.get("symptoms", []):
        compounds["galaxolide"] *= 0.5

    if "skin" in profile.get("symptoms", []):
        compounds["linalool"] *= 0.7
        
    intensity = profile.get("intensity_preference", "medium")
    if intensity == "low":
        for k in compounds:
            compounds[k] *= 0.7
    elif intensity == "high":
        for k in compounds:
            compounds[k] *= 1.2
            
    for k in compounds:
        compounds[k] = round(compounds[k], 4)

    return compounds