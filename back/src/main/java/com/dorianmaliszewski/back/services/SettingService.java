package com.dorianmaliszewski.back.services;

import com.dorianmaliszewski.back.enums.SettingEnum;
import com.dorianmaliszewski.back.models.Setting;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class SettingService {

    public List<Setting> getAllSettings () {
        return Setting.listAll();
    }

    public Setting getSetting(SettingEnum settingEnum) {
        return Setting.findById(settingEnum);
    }

    @Transactional
    public Setting updateSetting(Setting setting) {
        setting.persist();
        return setting;
    }

    @Transactional
    public Setting createSetting(Setting setting) {
        setting.persist();
        return setting;
    }

}
