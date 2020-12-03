package com.coco.back.main.graphql;

import com.coco.back.main.enums.SettingEnum;
import com.coco.back.main.models.Setting;
import com.coco.back.main.services.SettingService;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;

import javax.inject.Inject;
import java.util.List;

@GraphQLApi
public class SettingGraphQL {

    @Inject
    SettingService settingService;

    @Query("allSettings")
    @Description("Get all settings")
    public List<Setting> getAllSettings() {
        return settingService.getAllSettings();
    }

    @Query("settingById")
    @Description("Get setting by id")
    public Setting getSettingById(SettingEnum id) {
        return settingService.getSetting(id);
    }
}
